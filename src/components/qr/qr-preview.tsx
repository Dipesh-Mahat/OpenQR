'use client'

import Image from 'next/image'
import { QRCodeOptions } from '@/types/qr'
import { cn } from '@/lib/utils'
import { Loader2, Smartphone } from 'lucide-react'

interface QRPreviewProps {
  dataURL: string
  isGenerating: boolean
  options: QRCodeOptions
}

export function QRPreview({ dataURL, isGenerating, options }: QRPreviewProps) {
  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-80 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Generating QR code...</p>
        </div>
      </div>
    )
  }

  if (!dataURL) {
    return (
      <div className="flex items-center justify-center h-80 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-muted-foreground">
            Fill in the form to generate your QR code
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div 
        className={cn(
          "qr-preview p-4 rounded-lg shadow-lg",
          options.frame && "border-4",
          options.frame?.style === 'rounded' && "rounded-xl",
          options.frame?.style === 'circle' && "rounded-full",
          options.backgroundColor !== 'transparent' && "bg-white"
        )}
        style={{
          borderColor: options.frame?.color,
          backgroundColor: options.backgroundColor === 'transparent' ? 'transparent' : options.backgroundColor,
          backgroundImage: options.backgroundColor === 'transparent' 
            ? 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)' 
            : 'none',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        }}
      >
        <Image
          src={dataURL}
          alt="Generated QR Code"
          width={options.size}
          height={options.size}
          className="max-w-full h-auto"
        />
        {options.frame?.text && (
          <div 
            className="text-center mt-2 font-semibold text-sm"
            style={{ color: options.frame.textColor || '#000000' }}
          >
            {options.frame.text}
          </div>
        )}
      </div>
    </div>
  )
}
