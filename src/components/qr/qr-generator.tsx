'use client'

import { useState, useEffect } from 'react'
import { Target, Palette, Eye } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QRPreview } from './qr-preview'
import { QRCustomization } from './qr-customization'
import { QRExport } from './qr-export'
import { QRCodeGenerator } from '@/lib/qr-generator'
import { QRCodeOptions } from '@/types/qr'
import { useToast } from '@/components/ui/toaster'
import { Download, Share2, Copy, History } from 'lucide-react'

export function QRGenerator() {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [qrOptions, setQROptions] = useState<QRCodeOptions>({
    text: '',
    size: 300,
    margin: 4,
    errorCorrectionLevel: 'M',
    version: undefined, // Auto version selection by default
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    cornerSquareStyle: 'square',
    cornerDotStyle: 'square'
  })
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [capacityUsage, setCapacityUsage] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [history, setHistory] = useState<Array<{ id: string; text: string; dataURL: string; timestamp: number }>>([])
  const { toast } = useToast()

  // Generate QR code when data changes
  useEffect(() => {
    const generateQR = async () => {
      // Only generate if we have form data
      if (!formData || !formData.text || formData.text.trim() === '') {
        setQRCodeDataURL('')
        setCapacityUsage(0)
        setErrorMessage('')
        return
      }

      try {
        setIsGenerating(true)
        setErrorMessage('')
        const qrText = formData.text
        
        // Validate QR text
        if (!qrText || !qrText.trim()) {
          setQRCodeDataURL('')
          setCapacityUsage(0)
          return
        }

        // Calculate capacity usage
        const usage = QRCodeGenerator.estimateCapacityUsage(
          qrText, 
          qrOptions.errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H'
        )
        setCapacityUsage(usage)

        // Check if data might exceed capacity (warning at 95%)
        if (usage > 95 && !qrOptions.version) {
          setErrorMessage('Content size approaching maximum capacity. Consider using a lower error correction level or setting a higher version.')
        }

        const updatedOptions = { ...qrOptions, text: qrText }

        let dataURL: string
        if (updatedOptions.logoUrl) {
          dataURL = await QRCodeGenerator.generateWithLogo(updatedOptions)
        } else {
          dataURL = await QRCodeGenerator.generateQRCode(updatedOptions)
        }

        setQRCodeDataURL(dataURL)

        // Add to history only if we have a valid QR code
        if (dataURL) {
          const historyItem = {
            id: Date.now().toString(),
            text: qrText,
            dataURL,
            timestamp: Date.now()
          }
          setHistory(prev => [historyItem, ...prev.slice(0, 9)]) // Keep last 10 items
        }
      } catch (error) {
        console.error('Error generating QR code:', error)
        setQRCodeDataURL('')
        
        // Handle specific version error
        if (error instanceof Error && error.message.includes('cannot contain this amount of data')) {
          const match = error.message.match(/Minimum version required: (\d+)/)
          if (match) {
            const minVersion = parseInt(match[1])
            setErrorMessage(`Current QR version is too small. Minimum version ${minVersion} required for this content. Switch to "Auto" or select version ${minVersion} or higher.`)
            toast({
              title: 'Version Too Small',
              description: `Your content requires at least QR version ${minVersion}. Please adjust the version setting.`,
              variant: 'destructive'
            })
          } else {
            setErrorMessage(error.message)
            toast({
              title: 'Error',
              description: error.message,
              variant: 'destructive'
            })
          }
        } else {
          setErrorMessage('Failed to generate QR code. Your content may be too large for a QR code.')
          toast({
            title: 'Error',
            description: 'Failed to generate QR code. Your content may exceed the maximum capacity.',
            variant: 'destructive'
          })
        }
      } finally {
        setIsGenerating(false)
      }
    }

    // Debounce QR generation to prevent excessive calls
    const timeoutId = setTimeout(generateQR, 300)
    return () => clearTimeout(timeoutId)
  }, [formData, qrOptions, toast])

  const handleCopyToClipboard = async () => {
    try {
      const response = await fetch(qrCodeDataURL)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      toast({
        title: 'Success',
        description: 'QR code copied to clipboard!'
      })
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast({
        title: 'Error',
        description: 'Failed to copy QR code to clipboard.',
        variant: 'destructive'
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(qrCodeDataURL)
        const blob = await response.blob()
        const file = new File([blob], 'qrcode.png', { type: 'image/png' })
        
        await navigator.share({
          title: 'QR Code',
          text: 'Check out this QR code!',
          files: [file]
        })
      } catch (error) {
        console.error('Error sharing:', error)
        handleCopyToClipboard() // Fallback to copy
      }
    } else {
      handleCopyToClipboard() // Fallback to copy
    }
  }

  const loadFromHistory = (item: typeof history[0]) => {
    setFormData({ text: item.text })
    setQRCodeDataURL(item.dataURL)
    toast({
      title: 'Loaded',
      description: 'QR code loaded from history!'
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-7xl mx-auto">
      {/* Left Panel - Form */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              QR Code Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <label className="text-sm font-medium mb-3 block">Enter content for QR code</label>
              <input 
                type="text" 
                placeholder="Enter text, URL, or any content for your QR code" 
                value={formData.text || ''} 
                onChange={(e) => setFormData({ text: e.target.value })} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              
              {/* Capacity indicator */}
              {formData.text && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Capacity usage</span>
                    <span>{Math.round(capacityUsage)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        capacityUsage > 90 ? 'bg-red-500' : 
                        capacityUsage > 70 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`} 
                      style={{ width: `${Math.min(100, capacityUsage)}%` }}
                    ></div>
                  </div>
                  {errorMessage && (
                    <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
                  )}
                </div>
              )}
              
              {/* Advanced options */}
              <details className="mt-2">
                <summary className="text-sm font-medium cursor-pointer">Advanced options</summary>
                <div className="mt-3 space-y-3 p-3 border border-border rounded-md">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Error Correction Level</label>
                    <select
                      value={qrOptions.errorCorrectionLevel}
                      onChange={(e) => setQROptions(prev => ({ 
                        ...prev, 
                        errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' 
                      }))}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="L">Low (7% - Maximum data capacity)</option>
                      <option value="M">Medium (15% - Default)</option>
                      <option value="Q">Quartile (25% - Better scan reliability)</option>
                      <option value="H">High (30% - Best scan reliability)</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lower correction levels allow more data but reduce scan reliability.
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">QR Code Version (1-40)</label>
                    <select
                      value={qrOptions.version || ''}
                      onChange={(e) => setQROptions(prev => ({ 
                        ...prev, 
                        version: e.target.value ? Number(e.target.value) : undefined
                      }))}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Auto (recommended)</option>
                      {Array.from({ length: 40 }, (_, i) => i + 1).map(v => (
                        <option key={v} value={v}>Version {v} {v >= 25 ? '(large)' : ''}</option>
                      ))}
                    </select>
                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                      <p>Higher versions can store more data but create larger QR codes that may be harder to scan.</p>
                      {formData.text && (
                        <div className="flex items-center justify-between">
                          <p className="text-blue-600 dark:text-blue-400">
                            Minimum required version for current content: {QRCodeGenerator.getMinimumVersion(formData.text, qrOptions.errorCorrectionLevel)}
                          </p>
                          {qrOptions.version && qrOptions.version < QRCodeGenerator.getMinimumVersion(formData.text, qrOptions.errorCorrectionLevel) && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setQROptions(prev => ({ 
                                ...prev, 
                                version: QRCodeGenerator.getMinimumVersion(formData.text, qrOptions.errorCorrectionLevel) 
                              }))}
                              className="text-xs h-6 px-2"
                            >
                              Auto-fix
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Customization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QRCustomization
              options={qrOptions}
              onChange={setQROptions}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Preview and Export */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QRPreview
              dataURL={qrCodeDataURL}
              isGenerating={isGenerating}
              options={qrOptions}
            />
            
            {qrCodeDataURL && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  onClick={handleCopyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {qrCodeDataURL && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QRExport
                dataURL={qrCodeDataURL}
              />
            </CardContent>
          </Card>
        )}

        {history.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent QR Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {history.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="p-2 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Image
                      src={item.dataURL}
                      alt="QR Code"
                      width={80}
                      height={80}
                      className="w-full h-20 object-contain"
                    />
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {item.text.length > 20 ? item.text.substring(0, 20) + '...' : item.text}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
