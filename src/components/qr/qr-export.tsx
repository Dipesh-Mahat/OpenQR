'use client'

import { useState } from 'react'
import { QRCodeOptions, ExportOptions } from '@/types/qr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QRCodeGenerator } from '@/lib/qr-generator'
import { useToast } from '@/components/ui/toaster'
import { Download, FileImage, FileText, Image } from 'lucide-react'

interface QRExportProps {
  dataURL: string
  options?: QRCodeOptions
}

export function QRExport({ dataURL }: QRExportProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'png',
    size: 512,
    quality: 0.9,
    transparent: false
  })
  const [filename, setFilename] = useState('qrcode')
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const exportFormats = [
    { id: 'png', name: 'PNG', icon: Image, description: 'High quality with transparency support' },
    { id: 'jpg', name: 'JPG', icon: FileImage, description: 'Compressed format, smaller file size' },
    { id: 'svg', name: 'SVG', icon: FileText, description: 'Vector format, scalable' },
    // { id: 'pdf', name: 'PDF', icon: FileText, description: 'Document format' },
  ]

  const exportSizes = [
    { size: 256, label: '256x256' },
    { size: 512, label: '512x512' },
    { size: 1024, label: '1024x1024' },
    { size: 2048, label: '2048x2048' },
  ]

  const handleExport = async () => {
    if (!dataURL) return

    setIsExporting(true)
    try {
      await QRCodeGenerator.exportQRCode(dataURL, exportOptions, filename)
      // Toast removed as requested
    } catch (error) {
      console.error('Export error:', error)
      // Only show error toast for failures
      toast({
        title: 'Export Failed',
        description: 'Unable to export QR code. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsExporting(false)
    }
  }

  const quickExport = async (format: 'png' | 'svg' | 'jpg') => {
    // Update the current format in export options
    setExportOptions(prev => ({
      ...prev,
      format,
      transparent: format === 'png' ? prev.transparent : false
    }))
    
    const quickOptions: ExportOptions = {
      format,
      size: exportOptions.size,
      quality: 0.9,
      transparent: format === 'png' && exportOptions.transparent
    }
    
    setIsExporting(true)
    try {
      await QRCodeGenerator.exportQRCode(dataURL, quickOptions, `qrcode`)
      // Toast removed as requested
    } catch (error) {
      console.error('Quick export error:', error)
      // Only show error toast for failures
      toast({
        title: 'Download Failed',
        description: 'Unable to download QR code. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Export Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {exportFormats.slice(0, 3).map((format) => {
          const Icon = format.icon
          return (
            <Button
              key={format.id}
              variant="outline"
              onClick={() => quickExport(format.id as 'png' | 'svg' | 'jpg')}
              disabled={isExporting}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{format.name}</span>
            </Button>
          )
        })}
      </div>

      {/* Advanced Export Options */}
      <div className="border-t pt-4 space-y-4">
        <h4 className="font-medium text-sm">Advanced Export Options</h4>

        <div>
          <label className="text-sm font-medium block mb-2">Export Size</label>
          <div className="grid grid-cols-2 gap-2">
            {exportSizes.map((sizeOption) => (
              <Button
                key={sizeOption.size}
                variant={exportOptions.size === sizeOption.size ? 'default' : 'outline'}
                onClick={() => setExportOptions(prev => ({ ...prev, size: sizeOption.size }))}
                size="sm"
              >
                {sizeOption.label}
              </Button>
            ))}
          </div>
          <div className="mt-2">
            <Input
              type="number"
              value={exportOptions.size}
              onChange={(e) => setExportOptions(prev => ({ 
                ...prev, 
                size: Math.max(100, Math.min(4096, parseInt(e.target.value) || 512))
              }))}
              placeholder="Custom size"
              min="100"
              max="4096"
            />
          </div>
        </div>

        {exportOptions.format === 'png' && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="transparent"
              checked={exportOptions.transparent}
              onChange={(e) => setExportOptions(prev => ({ 
                ...prev, 
                transparent: e.target.checked 
              }))}
              className="rounded"
            />
            <label htmlFor="transparent" className="text-sm">
              Transparent background
            </label>
          </div>
        )}

        <div>
          <label className="text-sm font-medium block mb-2">Filename</label>
          <Input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
            placeholder="qrcode"
          />
        </div>

        <Button
          onClick={handleExport}
          disabled={isExporting || !dataURL}
          className="w-full flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Exporting...' : `Export as ${exportOptions.format.toUpperCase()}`}
        </Button>
      </div>
    </div>
  )
}
