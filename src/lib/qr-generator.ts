import QRCodeLib from 'qrcode'
import { QRCodeOptions, ExportOptions } from '@/types/qr'

export class QRCodeGenerator {
  static async generateQRCode(options: QRCodeOptions): Promise<string> {
    const qrOptions = {
      errorCorrectionLevel: options.errorCorrectionLevel,
      margin: options.margin,
      width: options.size,
      color: {
        dark: options.foregroundColor,
        light: options.backgroundColor,
      },
    }

    try {
      // Generate QR code as data URL
      const dataURL = await QRCodeLib.toDataURL(options.text, qrOptions)
      
      // If no gradient is set, return the basic QR code
      if (!options.gradient) {
        return dataURL
      }
      
      // For gradient QR codes, we need to apply the gradient via canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return dataURL // Fallback if canvas is not supported
      
      canvas.width = options.size
      canvas.height = options.size
      
      // Create gradient
      let gradient
      if (options.gradient.type === 'linear') {
        const angle = options.gradient.rotation * Math.PI / 180
        const x0 = options.size / 2 - Math.cos(angle) * options.size / 2
        const y0 = options.size / 2 - Math.sin(angle) * options.size / 2
        const x1 = options.size / 2 + Math.cos(angle) * options.size / 2
        const y1 = options.size / 2 + Math.sin(angle) * options.size / 2
        
        gradient = ctx.createLinearGradient(x0, y0, x1, y1)
      } else {
        // Radial gradient
        gradient = ctx.createRadialGradient(
          options.size / 2, options.size / 2, 0,
          options.size / 2, options.size / 2, options.size / 2
        )
      }
      
      // Add color stops
      options.gradient.colorStops.forEach(stop => {
        gradient.addColorStop(stop.offset, stop.color)
      })
      
      // Load the QR code as an image
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          // Draw background
          ctx.fillStyle = options.backgroundColor
          ctx.fillRect(0, 0, options.size, options.size)
          
          // Draw QR code
          ctx.drawImage(img, 0, 0, options.size, options.size)
          
          // Apply gradient to QR code (only where QR code is drawn)
          ctx.globalCompositeOperation = 'source-in'
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, options.size, options.size)
          
          // Reset composite operation
          ctx.globalCompositeOperation = 'source-over'
          
          resolve(canvas.toDataURL())
        }
        img.onerror = reject
        img.src = dataURL
      })
    } catch (error) {
      console.error('Error generating QR code:', error)
      throw new Error('Failed to generate QR code')
    }
  }

  static async generateSVG(options: QRCodeOptions): Promise<string> {
    const qrOptions = {
      errorCorrectionLevel: options.errorCorrectionLevel,
      margin: options.margin,
      width: options.size,
      color: {
        dark: options.foregroundColor,
        light: options.backgroundColor,
      },
    }

    try {
      const svg = await QRCodeLib.toString(options.text, { 
        ...qrOptions, 
        type: 'svg' 
      })
      return svg
    } catch (error) {
      console.error('Error generating SVG QR code:', error)
      throw new Error('Failed to generate SVG QR code')
    }
  }

  static async generateWithLogo(options: QRCodeOptions): Promise<string> {
    // First generate QR code with patterns and other styling
    const qrDataURL = await this.generateQRCode({
      ...options,
      errorCorrectionLevel: 'H' as 'H' // Force high error correction for logo
    })

    // Then add the logo on top
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported')

    canvas.width = options.size
    canvas.height = options.size

    return new Promise((resolve, reject) => {
      const qrImage = new Image()
      qrImage.crossOrigin = 'anonymous'
      
      qrImage.onload = () => {
        ctx.drawImage(qrImage, 0, 0, options.size, options.size)

        if (options.logoUrl && options.logoSize) {
          const logo = new Image()
          logo.crossOrigin = 'anonymous'
          logo.onload = () => {
            const logoSize = Math.min(options.logoSize || options.size * 0.2, options.size * 0.3)
            const x = (options.size - logoSize) / 2
            const y = (options.size - logoSize) / 2

            // Add white background padding for logo (clear the QR code area)
            const padding = logoSize * 0.1
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(x - padding, y - padding, logoSize + (padding * 2), logoSize + (padding * 2))

            // Draw logo
            ctx.drawImage(logo, x, y, logoSize, logoSize)
            resolve(canvas.toDataURL())
          }
          logo.onerror = () => resolve(canvas.toDataURL())
          logo.src = options.logoUrl
        } else {
          resolve(canvas.toDataURL())
        }
      }
      qrImage.onerror = reject
      qrImage.src = qrDataURL
    })
  }

  static async exportQRCode(
    dataURL: string, 
    exportOptions: ExportOptions,
    filename: string
  ): Promise<void> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported')

    const img = new Image()
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = exportOptions.size
        canvas.height = exportOptions.size

        if (!exportOptions.transparent) {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, exportOptions.size, exportOptions.size)
        }

        ctx.drawImage(img, 0, 0, exportOptions.size, exportOptions.size)

        if (exportOptions.format === 'svg') {
          // For SVG, we'd need to use a different approach
          // This is a simplified version
          const svgBlob = new Blob([dataURL], { type: 'image/svg+xml' })
          const url = URL.createObjectURL(svgBlob)
          this.downloadFile(url, `${filename}.svg`)
          resolve()
        } else {
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              this.downloadFile(url, `${filename}.${exportOptions.format}`)
              resolve()
            } else {
              reject(new Error('Failed to create blob'))
            }
          }, `image/${exportOptions.format}`, exportOptions.quality || 0.9)
        }
      }
      img.onerror = reject
      img.src = dataURL
    })
  }

  private static downloadFile(url: string, filename: string) {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
