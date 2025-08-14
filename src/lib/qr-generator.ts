import QRCodeLib from 'qrcode'
import { QRCodeOptions, ExportOptions } from '@/types/qr'

// Extend the QRCodeLib with proper TypeScript types
declare module 'qrcode' {
  export function toDataURL(text: string, options?: any): Promise<string>
  export function toString(text: string, options?: any): Promise<string>
}

export class QRCodeGenerator {
  // Maximum capacity in characters (approximate) for different modes
  static readonly CAPACITY_MAP = {
    L: { // Low error correction
      numeric: 7089,
      alphanumeric: 4296,
      byte: 2953,
    },
    M: { // Medium error correction
      numeric: 5596,
      alphanumeric: 3391,
      byte: 2331,
    },
    Q: { // Quartile error correction
      numeric: 3993,
      alphanumeric: 2420,
      byte: 1663,
    },
    H: { // High error correction
      numeric: 3057,
      alphanumeric: 1852,
      byte: 1273,
    }
  }

  // Check if input is purely numeric
  static isNumeric(text: string): boolean {
    return /^\d+$/.test(text)
  }

  // Check if input is alphanumeric according to QR code spec
  static isAlphanumeric(text: string): boolean {
    return /^[0-9A-Z $%*+\-./:]+$/i.test(text)
  }

  // Get the most appropriate encoding mode for the given text
  static getEncodingMode(text: string): 'numeric' | 'alphanumeric' | 'byte' {
    if (this.isNumeric(text)) return 'numeric'
    if (this.isAlphanumeric(text)) return 'alphanumeric'
    return 'byte'
  }

  // Estimate remaining capacity as a percentage
  static estimateCapacityUsage(text: string, errorLevel: 'L' | 'M' | 'Q' | 'H'): number {
    const mode = this.getEncodingMode(text)
    const maxCapacity = this.CAPACITY_MAP[errorLevel][mode]
    return Math.min(100, (text.length / maxCapacity) * 100)
  }

  static async generateQRCode(options: QRCodeOptions): Promise<string> {
    const qrOptions: any = {
      errorCorrectionLevel: options.errorCorrectionLevel,
      margin: options.margin,
      width: options.size,
      color: {
        dark: options.foregroundColor,
        light: options.backgroundColor === 'transparent' ? '#ffffff' : options.backgroundColor,
      },
    }
    
    // Set version if specified (allows for larger data capacity)
    if (options.version) {
      qrOptions.version = options.version
    }

    try {
      // Generate QR code as data URL
      const dataURL: string = await QRCodeLib.toDataURL(options.text, qrOptions)
      
      // If no gradient is set and no transparent background, return the basic QR code
      if (!options.gradient && options.backgroundColor !== 'transparent') {
        return dataURL
      }
      
      // For gradient QR codes or transparent backgrounds, we need to apply via canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return dataURL // Fallback if canvas is not supported
      
      canvas.width = options.size
      canvas.height = options.size
      
      // Create gradient if specified
      if (options.gradient) {
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
        return new Promise<string>((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            // For transparent background, don't fill the background
            if (options.backgroundColor !== 'transparent') {
              ctx.fillStyle = options.backgroundColor
              ctx.fillRect(0, 0, options.size, options.size)
            }
            
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
      } else if (options.backgroundColor === 'transparent') {
        // Handle transparent background without gradient
        return new Promise<string>((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            // Set canvas to have transparent background
            ctx.clearRect(0, 0, options.size, options.size)
            
            // Draw QR code
            ctx.drawImage(img, 0, 0, options.size, options.size)
            
            // Make white parts transparent
            ctx.globalCompositeOperation = 'destination-in'
            ctx.fillStyle = 'black'
            ctx.drawImage(img, 0, 0, options.size, options.size)
            
            // Reset composite operation
            ctx.globalCompositeOperation = 'source-over'
            
            resolve(canvas.toDataURL('image/png'))
          }
          img.onerror = reject
          img.src = dataURL
        })
      } else {
        return dataURL
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
      throw new Error('Failed to generate QR code')
    }
  }

  static async generateSVG(options: QRCodeOptions): Promise<string> {
    const qrOptions: any = {
      errorCorrectionLevel: options.errorCorrectionLevel,
      margin: options.margin,
      width: options.size,
      color: {
        dark: options.foregroundColor,
        light: options.backgroundColor === 'transparent' ? '#ffffff' : options.backgroundColor,
      },
      type: 'svg'
    }
    
    // Set version if specified
    if (options.version) {
      qrOptions.version = options.version
    }

    try {
      const svg: string = await QRCodeLib.toString(options.text, qrOptions)
      return svg
    } catch (error) {
      console.error('Error generating SVG QR code:', error)
      throw new Error('Failed to generate SVG QR code')
    }
  }

  static async generateWithLogo(options: QRCodeOptions): Promise<string> {
    // Force high error correction for logo
    const highErrorOptions = { ...options, errorCorrectionLevel: 'H' as 'H' }
    
    // First generate QR code with patterns and other styling
    const qrDataURL = await this.generateQRCode(highErrorOptions)

    // Then add the logo on top
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported')

    canvas.width = options.size
    canvas.height = options.size

    return new Promise<string>((resolve, reject) => {
      const qrImage = new Image()
      qrImage.crossOrigin = 'anonymous'
      
      qrImage.onload = () => {
        // For transparent background, don't fill the canvas first
        if (options.backgroundColor === 'transparent') {
          ctx.clearRect(0, 0, options.size, options.size)
        }
        
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
            resolve(canvas.toDataURL('image/png'))
          }
          logo.onerror = () => resolve(canvas.toDataURL('image/png'))
          logo.src = options.logoUrl
        } else {
          resolve(canvas.toDataURL('image/png'))
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
    
    return new Promise<void>((resolve, reject) => {
      img.onload = () => {
        canvas.width = exportOptions.size
        canvas.height = exportOptions.size

        // If transparent option is set, don't fill the background
        if (!exportOptions.transparent) {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, exportOptions.size, exportOptions.size)
        } else {
          // Ensure canvas is cleared for transparent background
          ctx.clearRect(0, 0, exportOptions.size, exportOptions.size)
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
          const mimeType = exportOptions.format === 'jpg' ? 'image/jpeg' : 'image/png'
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              this.downloadFile(url, `${filename}.${exportOptions.format}`)
              resolve()
            } else {
              reject(new Error('Failed to create blob'))
            }
          }, mimeType, exportOptions.quality || 0.9)
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
