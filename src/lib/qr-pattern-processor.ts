import { QRCodeOptions } from '@/types/qr'

export class QRPatternProcessor {
  /**
   * Applies the selected pattern style to a QR code image
   */
  static applyPatternStyle(
    qrImageUrl: string, 
    options: QRCodeOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(qrImageUrl) // Fallback if canvas not supported
        return
      }

      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        const size = options.size
        canvas.width = size
        canvas.height = size
        
        // Draw background
        ctx.fillStyle = options.backgroundColor
        ctx.fillRect(0, 0, size, size)

        // Get image data to process individual QR code modules
        ctx.drawImage(img, 0, 0, size, size)
        const imageData = ctx.getImageData(0, 0, size, size)
        const data = imageData.data

        // Clear canvas for redrawing with patterns
        ctx.clearRect(0, 0, size, size)
        ctx.fillStyle = options.backgroundColor
        ctx.fillRect(0, 0, size, size)

        // Determine module size and positions
        const moduleSize = this.findModuleSize(data, size)
        const modules = this.identifyModules(data, size, moduleSize)
        
        // Apply the selected pattern style
        this.drawModulesWithPattern(ctx, modules, moduleSize, options)
        
        resolve(canvas.toDataURL())
      }
      
      img.onerror = () => reject(new Error('Failed to load QR code image'))
      img.src = qrImageUrl
    })
  }

  /**
   * Estimates the size of a QR code module
   */
  private static findModuleSize(data: Uint8ClampedArray, size: number): number {
    // Sample the center area to find module size
    const center = Math.floor(size / 2)
    let inModule = data[(center * size + center) * 4] < 128 // Dark pixel
    let moduleStart = -1
    let moduleEnd = -1
    
    // Scan horizontally through the center to find a module
    for (let x = 0; x < size; x++) {
      const isDark = data[(center * size + x) * 4] < 128
      
      if (isDark !== inModule) {
        if (inModule) {
          moduleEnd = x
          return moduleEnd - moduleStart
        } else {
          moduleStart = x
        }
        inModule = isDark
      }
    }
    
    // Default size if detection fails
    return Math.floor(size / 29) // Typical QR code has 21-177 modules
  }

  /**
   * Identifies all QR code modules
   */
  private static identifyModules(
    data: Uint8ClampedArray, 
    size: number, 
    moduleSize: number
  ): boolean[][] {
    const modulesCount = Math.ceil(size / moduleSize)
    const modules: boolean[][] = Array(modulesCount).fill(0).map(() => Array(modulesCount).fill(false))
    
    for (let y = 0; y < modulesCount; y++) {
      for (let x = 0; x < modulesCount; x++) {
        const pixelX = Math.floor(x * moduleSize + moduleSize / 2)
        const pixelY = Math.floor(y * moduleSize + moduleSize / 2)
        
        if (pixelX < size && pixelY < size) {
          // Sample the center of each module
          const index = (pixelY * size + pixelX) * 4
          modules[y][x] = data[index] < 128 // Dark pixel = true module
        }
      }
    }
    
    return modules
  }

  /**
   * Draws QR modules with the selected pattern style
   */
  private static drawModulesWithPattern(
    ctx: CanvasRenderingContext2D, 
    modules: boolean[][], 
    moduleSize: number, 
    options: QRCodeOptions
  ): void {
    const { pattern, foregroundColor, gradient } = options
    const padding = 0.1 * moduleSize // Padding between modules for some patterns
    
    // Set fill style (gradient or solid color)
    if (gradient) {
      let gradientFill
      if (gradient.type === 'linear') {
        const angle = gradient.rotation * Math.PI / 180
        const size = options.size
        const x0 = size / 2 - Math.cos(angle) * size / 2
        const y0 = size / 2 - Math.sin(angle) * size / 2
        const x1 = size / 2 + Math.cos(angle) * size / 2
        const y1 = size / 2 + Math.sin(angle) * size / 2
        
        gradientFill = ctx.createLinearGradient(x0, y0, x1, y1)
      } else {
        // Radial gradient
        gradientFill = ctx.createRadialGradient(
          options.size / 2, options.size / 2, 0,
          options.size / 2, options.size / 2, options.size / 2
        )
      }
      
      gradient.colorStops.forEach(stop => {
        gradientFill.addColorStop(stop.offset, stop.color)
      })
      
      ctx.fillStyle = gradientFill
    } else {
      ctx.fillStyle = foregroundColor
    }

    // Draw each module according to selected pattern
    for (let y = 0; y < modules.length; y++) {
      for (let x = 0; x < modules[y].length; x++) {
        if (modules[y][x]) {
          const xPos = x * moduleSize
          const yPos = y * moduleSize
          
          switch (pattern) {
            case 'dots':
              // Draw circular dots
              ctx.beginPath()
              ctx.arc(
                xPos + moduleSize / 2, 
                yPos + moduleSize / 2,
                (moduleSize - padding * 2) / 2,
                0,
                Math.PI * 2
              )
              ctx.fill()
              break
              
            case 'rounded':
              // Draw rounded squares
              const radius = moduleSize / 5
              ctx.beginPath()
              ctx.moveTo(xPos + padding + radius, yPos + padding)
              ctx.lineTo(xPos + moduleSize - padding - radius, yPos + padding)
              ctx.arcTo(xPos + moduleSize - padding, yPos + padding, xPos + moduleSize - padding, yPos + padding + radius, radius)
              ctx.lineTo(xPos + moduleSize - padding, yPos + moduleSize - padding - radius)
              ctx.arcTo(xPos + moduleSize - padding, yPos + moduleSize - padding, xPos + moduleSize - padding - radius, yPos + moduleSize - padding, radius)
              ctx.lineTo(xPos + padding + radius, yPos + moduleSize - padding)
              ctx.arcTo(xPos + padding, yPos + moduleSize - padding, xPos + padding, yPos + moduleSize - padding - radius, radius)
              ctx.lineTo(xPos + padding, yPos + padding + radius)
              ctx.arcTo(xPos + padding, yPos + padding, xPos + padding + radius, yPos + padding, radius)
              ctx.fill()
              break
              
            case 'extra-rounded':
              // Draw highly rounded squares (almost circles but still square-ish)
              const bigRadius = moduleSize / 2.5
              ctx.beginPath()
              ctx.moveTo(xPos + padding + bigRadius, yPos + padding)
              ctx.lineTo(xPos + moduleSize - padding - bigRadius, yPos + padding)
              ctx.arcTo(xPos + moduleSize - padding, yPos + padding, xPos + moduleSize - padding, yPos + padding + bigRadius, bigRadius)
              ctx.lineTo(xPos + moduleSize - padding, yPos + moduleSize - padding - bigRadius)
              ctx.arcTo(xPos + moduleSize - padding, yPos + moduleSize - padding, xPos + moduleSize - padding - bigRadius, yPos + moduleSize - padding, bigRadius)
              ctx.lineTo(xPos + padding + bigRadius, yPos + moduleSize - padding)
              ctx.arcTo(xPos + padding, yPos + moduleSize - padding, xPos + padding, yPos + moduleSize - padding - bigRadius, bigRadius)
              ctx.lineTo(xPos + padding, yPos + padding + bigRadius)
              ctx.arcTo(xPos + padding, yPos + padding, xPos + padding + bigRadius, yPos + padding, bigRadius)
              ctx.fill()
              break
              
            case 'squares':
            default:
              // Draw plain squares
              ctx.fillRect(
                xPos + padding, 
                yPos + padding, 
                moduleSize - padding * 2, 
                moduleSize - padding * 2
              )
              break
          }
        }
      }
    }
  }
}
