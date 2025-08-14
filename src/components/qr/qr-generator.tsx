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
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    cornerSquareStyle: 'square',
    cornerDotStyle: 'square'
  })
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<Array<{ id: string; text: string; dataURL: string; timestamp: number }>>([])
  const { toast } = useToast()

  // Generate QR code when data changes
  useEffect(() => {
    const generateQR = async () => {
      // Only generate if we have form data
      if (!formData || !formData.text || formData.text.trim() === '') {
        setQRCodeDataURL('')
        return
      }

      try {
        setIsGenerating(true)
        const qrText = formData.text
        
        // Validate QR text
        if (!qrText || !qrText.trim()) {
          setQRCodeDataURL('')
          return
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
        toast({
          title: 'Error',
          description: 'Failed to generate QR code. Please check your input.',
          variant: 'destructive'
        })
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
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
