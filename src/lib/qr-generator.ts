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
      const dataURL = await QRCodeLib.toDataURL(options.text, qrOptions)
      return dataURL
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
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported')

    canvas.width = options.size
    canvas.height = options.size

    // Generate base QR code
    const qrDataURL = await this.generateQRCode(options)
    const qrImage = new Image()

    return new Promise((resolve, reject) => {
      qrImage.onload = () => {
        ctx.drawImage(qrImage, 0, 0, options.size, options.size)

        if (options.logoUrl && options.logoSize) {
          const logo = new Image()
          logo.crossOrigin = 'anonymous'
          logo.onload = () => {
            const logoSize = options.logoSize || options.size * 0.2
            const x = (options.size - logoSize) / 2
            const y = (options.size - logoSize) / 2

            // Add white background for logo
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10)

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
