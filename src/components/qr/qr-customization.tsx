'use client'

import { useState } from 'react'
import Image from 'next/image'
import { QRCodeOptions } from '@/types/qr'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Palette, Settings, ImageIcon, Frame, Sparkles } from 'lucide-react'
import { QRAnimation } from './qr-animation'
import { QRARView } from './qr-ar-view'
import { QRSmartConditions } from './qr-smart-conditions'
import { QRPasswordProtection } from './qr-password-protection'

interface QRCustomizationProps {
  options: QRCodeOptions
  onChange: (options: QRCodeOptions) => void
}

export function QRCustomization({ options, onChange }: QRCustomizationProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'style' | 'logo' | 'frame' | 'advanced'>('colors')

  const updateOptions = (updates: Partial<QRCodeOptions>) => {
    onChange({ ...options, ...updates })
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string
        updateOptions({ 
          logoUrl,
          logoSize: options.logoSize || options.size * 0.2 
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const presetColors = [
    { name: 'Classic', fg: '#000000', bg: '#ffffff' },
    { name: 'Inverted', fg: '#ffffff', bg: '#000000' },
    { name: 'Blue', fg: '#1e40af', bg: '#dbeafe' },
    { name: 'Green', fg: '#16a34a', bg: '#dcfce7' },
    { name: 'Purple', fg: '#7c3aed', bg: '#ede9fe' },
    { name: 'Orange', fg: '#ea580c', bg: '#fed7aa' },
  ]

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'style', label: 'Style', icon: Settings },
    { id: 'logo', label: 'Logo', icon: ImageIcon },
    { id: 'frame', label: 'Frame', icon: Frame },
    { id: 'advanced', label: 'Advanced', icon: Sparkles },
  ] as const

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Tab Content */}
      <Card>
        <CardContent className="pt-6">
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {presetColors.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    className="h-auto p-2 flex flex-col items-center gap-1"
                    onClick={() => updateOptions({
                      foregroundColor: preset.fg,
                      backgroundColor: preset.bg
                    })}
                  >
                    <div className="flex">
                      <div 
                        className="w-4 h-4 border"
                        style={{ backgroundColor: preset.fg }}
                      />
                      <div 
                        className="w-4 h-4 border"
                        style={{ backgroundColor: preset.bg }}
                      />
                    </div>
                    <span className="text-xs">{preset.name}</span>
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Foreground Color</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={options.foregroundColor}
                      onChange={(e) => updateOptions({ foregroundColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={options.foregroundColor}
                      onChange={(e) => updateOptions({ foregroundColor: e.target.value })}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Background Color</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={options.backgroundColor}
                      onChange={(e) => updateOptions({ backgroundColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={options.backgroundColor}
                      onChange={(e) => updateOptions({ backgroundColor: e.target.value })}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Size (px)</label>
                  <Input
                    type="range"
                    min="100"
                    max="800"
                    value={options.size}
                    onChange={(e) => updateOptions({ size: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground mt-1">
                    {options.size}px
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Margin</label>
                  <Input
                    type="range"
                    min="0"
                    max="10"
                    value={options.margin}
                    onChange={(e) => updateOptions({ margin: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground mt-1">
                    {options.margin}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Error Correction Level</label>
                <select
                  value={options.errorCorrectionLevel}
                  onChange={(e) => updateOptions({ 
                    errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' 
                  })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Pattern Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {['squares', 'dots', 'rounded', 'extra-rounded'].map((pattern) => (
                    <Button
                      key={pattern}
                      variant={options.pattern === pattern ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateOptions({ pattern: pattern as 'dots' | 'squares' | 'classy' | 'classy-rounded' | 'rounded' | 'extra-rounded' })}
                      className="capitalize"
                    >
                      {pattern}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logo' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Upload Logo</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a logo to place in the center of your QR code
                </p>
              </div>

              {options.logoUrl && (
                <div>
                  <label className="text-sm font-medium block mb-2">Logo Size</label>
                  <Input
                    type="range"
                    min="20"
                    max={options.size * 0.4}
                    value={options.logoSize || options.size * 0.2}
                    onChange={(e) => updateOptions({ logoSize: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground mt-1">
                    {options.logoSize || Math.round(options.size * 0.2)}px
                  </div>
                </div>
              )}

              {options.logoUrl && (
                <div className="text-center">
                  <Image
                    src={options.logoUrl}
                    alt="Logo preview"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain border rounded mx-auto"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateOptions({ logoUrl: undefined, logoSize: undefined })}
                    className="mt-2"
                  >
                    Remove Logo
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'frame' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Frame Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {['none', 'square', 'rounded', 'circle'].map((style) => (
                    <Button
                      key={style}
                      variant={options.frame?.style === style ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateOptions({ 
                        frame: style === 'none' ? undefined : { 
                          ...options.frame,
                          style: style as 'square' | 'rounded' | 'circle' | 'banner',
                          color: options.frame?.color || '#000000'
                        }
                      })}
                      className="capitalize"
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>

              {options.frame && (
                <>
                  <div>
                    <label className="text-sm font-medium block mb-2">Frame Color</label>
                    <Input
                      type="color"
                      value={options.frame.color}
                      onChange={(e) => updateOptions({
                        frame: { ...options.frame!, color: e.target.value }
                      })}
                      className="w-full h-10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">Frame Text (Optional)</label>
                    <Input
                      type="text"
                      value={options.frame.text || ''}
                      onChange={(e) => updateOptions({
                        frame: { ...options.frame!, text: e.target.value }
                      })}
                      placeholder="Scan me!"
                    />
                  </div>

                  {options.frame.text && (
                    <div>
                      <label className="text-sm font-medium block mb-2">Text Color</label>
                      <Input
                        type="color"
                        value={options.frame.textColor || '#000000'}
                        onChange={(e) => updateOptions({
                          frame: { ...options.frame!, textColor: e.target.value }
                        })}
                        className="w-full h-10"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {activeTab === 'advanced' && (
            <div className="space-y-8">
              <QRAnimation options={options} onChange={onChange} />
              
              <div className="border-t pt-8">
                <QRARView options={options} onChange={onChange} />
              </div>
              
              <div className="border-t pt-8">
                <QRSmartConditions options={options} onChange={onChange} />
              </div>
              
              <div className="border-t pt-8">
                <QRPasswordProtection options={options} onChange={onChange} />
              </div>
              
              <div className="rounded-md bg-yellow-50 dark:bg-yellow-950 p-3 text-xs text-yellow-700 dark:text-yellow-300">
                <p className="font-medium mb-1">Advanced Features:</p>
                <p>These exclusive features make your QR codes truly special. Note that some advanced features may not be supported by all QR code scanners.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
