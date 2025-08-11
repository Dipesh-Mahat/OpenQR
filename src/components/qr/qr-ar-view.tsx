'use client'

import { useState } from 'react'
import { QRCodeOptions } from '@/types/qr'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Image, Video, Film, Eye } from 'lucide-react'

interface QRARViewProps {
  options: QRCodeOptions
  onChange: (options: QRCodeOptions) => void
}

export function QRARView({ options, onChange }: QRARViewProps) {
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video' | '3d'>('image')
  const [arEnabled, setArEnabled] = useState(false)

  const updateOptions = (updates: Partial<QRCodeOptions>) => {
    // First create a copy of options without any 'arContent' property
    const { arContent, ...optionsCopy } = options;
    
    // Then merge with updates
    onChange({ ...optionsCopy, ...updates });
  }

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        setMediaUrl(url)
        
        // Update QR options with AR content
        const updatedText = `AR:${mediaType}:${url}`;
        updateOptions({ 
          text: updatedText
        })
        
        setArEnabled(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const mediaTypes = [
    { id: 'image', name: 'Image', icon: Image, accept: 'image/*' },
    { id: 'video', name: 'Video', icon: Video, accept: 'video/*' },
    { id: '3d', name: '3D Model', icon: Film, accept: '.glb,.gltf' },
  ]

  const toggleAR = () => {
    if (arEnabled) {
      // Disable AR
      updateOptions({ text: options.text.replace(/^AR:.*?:/, '') })
      setArEnabled(false)
    } else if (mediaUrl) {
      // Enable AR
      const updatedText = `AR:${mediaType}:${mediaUrl}`;
      updateOptions({ text: updatedText })
      setArEnabled(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Augmented Reality QR</h3>
        
        {mediaUrl && (
          <Button 
            size="sm" 
            variant={arEnabled ? "default" : "outline"}
            onClick={toggleAR}
          >
            <Eye className="w-4 h-4 mr-2" />
            {arEnabled ? 'AR Enabled' : 'Enable AR'}
          </Button>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Link your QR code to images, videos or 3D models that appear when scanned with AR-capable devices.
      </p>
      
      <div className="grid grid-cols-3 gap-2">
        {mediaTypes.map((type) => {
          const Icon = type.icon
          return (
            <Button
              key={type.id}
              variant={mediaType === type.id ? 'default' : 'outline'}
              onClick={() => setMediaType(type.id as any)}
              className="h-auto py-3 px-2 flex flex-col items-center gap-2"
            >
              <div className="rounded-full p-2 bg-primary/10 text-primary">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs">{type.name}</span>
            </Button>
          )
        })}
      </div>
      
      <div>
        <label className="text-sm font-medium block mb-2">Upload {mediaType} for AR</label>
        <Input
          type="file"
          accept={mediaTypes.find(t => t.id === mediaType)?.accept}
          onChange={handleMediaUpload}
          className="cursor-pointer"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {mediaType === 'image' && 'Upload an image that will appear when the QR code is scanned'}
          {mediaType === 'video' && 'Upload a video that will play when the QR code is scanned'}
          {mediaType === '3d' && 'Upload a 3D model (.glb/.gltf) that will appear in AR when scanned'}
        </p>
      </div>
      
      {mediaUrl && (
        <div className="rounded-md bg-primary/5 p-3 text-center">
          <p className="text-sm font-medium mb-2">AR Content Preview</p>
          {mediaType === 'image' && (
            <img 
              src={mediaUrl} 
              alt="AR Preview" 
              className="max-h-32 mx-auto rounded-md object-contain" 
            />
          )}
          {mediaType === 'video' && (
            <video 
              src={mediaUrl} 
              controls 
              className="max-h-32 w-full mx-auto rounded-md" 
            />
          )}
          {mediaType === '3d' && (
            <div className="bg-primary/10 rounded-md p-6 text-center">
              <Film className="w-8 h-8 mx-auto text-primary mb-2" />
              <p className="text-xs">3D Model Selected</p>
            </div>
          )}
        </div>
      )}
      
      {arEnabled && (
        <div className="rounded-md bg-green-50 dark:bg-green-950 p-2 text-xs text-green-700 dark:text-green-300">
          Your QR code is AR-enabled! When scanned with an AR-capable device, it will display your content.
        </div>
      )}
    </div>
  )
}
