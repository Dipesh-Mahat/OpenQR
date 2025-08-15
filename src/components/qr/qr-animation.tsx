'use client'

import { useState } from 'react'
import { QRCodeOptions } from '@/types/qr'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Pause, 
  Sparkles,
  Palette,
  RotateCcw
} from 'lucide-react'

interface QRAnimationProps {
  options: QRCodeOptions
  onChange: (options: QRCodeOptions) => void
}

export function QRAnimation({ options, onChange }: QRAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(2000) // ms
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  
  const updateOptions = (updates: Partial<QRCodeOptions>) => {
    onChange({ ...options, ...updates })
  }

  const animationTypes = [
    { id: 'color-pulse', name: 'Color Pulse', icon: Palette },
    { id: 'gradient-shift', name: 'Gradient Shift', icon: Sparkles },
    { id: 'pattern-morph', name: 'Pattern Morph', icon: RotateCcw },
  ]

  // Animation presets
  const colorPulsePresets = [
    { fg: '#000000', bg: '#ffffff' },
    { fg: '#1e40af', bg: '#dbeafe' },
    { fg: '#16a34a', bg: '#dcfce7' },
    { fg: '#7c3aed', bg: '#ede9fe' },
    { fg: '#ea580c', bg: '#fed7aa' },
  ]

  const patternPresets = [
    'squares', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'
  ]

  const gradientShiftPresets = [
    {
      type: 'linear' as const,
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#3b82f6' },
        { offset: 1, color: '#8b5cf6' }
      ]
    },
    {
      type: 'linear' as const,
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#f97316' },
        { offset: 1, color: '#ec4899' }
      ]
    },
    {
      type: 'radial' as const,
      rotation: 0,
      colorStops: [
        { offset: 0, color: '#10b981' },
        { offset: 1, color: '#3b82f6' }
      ]
    }
  ]

  const toggleAnimation = (type: string) => {
    if (isAnimating) {
      // Stop animation
      if (intervalId) {
        clearInterval(intervalId)
        setIntervalId(null)
      }
      setIsAnimating(false)
    } else {
      // Start animation
      let currentIndex = 0
      
      let newIntervalId: NodeJS.Timeout | null = null;
      
      if (type === 'color-pulse') {
        newIntervalId = setInterval(() => {
          const preset = colorPulsePresets[currentIndex]
          updateOptions({
            foregroundColor: preset.fg,
            backgroundColor: preset.bg
          })
          currentIndex = (currentIndex + 1) % colorPulsePresets.length
        }, animationSpeed)
      } else if (type === 'pattern-morph') {
        newIntervalId = setInterval(() => {
          const pattern = patternPresets[currentIndex]
          // Set the pattern in the options
          updateOptions({
            pattern: pattern,
            animation: {
              enabled: true,
              type: 'pattern-morph',
              speed: animationSpeed
            }
          })
          currentIndex = (currentIndex + 1) % patternPresets.length
        }, animationSpeed)
      } else if (type === 'gradient-shift') {
        newIntervalId = setInterval(() => {
          const gradient = gradientShiftPresets[currentIndex]
          updateOptions({ gradient })
          currentIndex = (currentIndex + 1) % gradientShiftPresets.length
        }, animationSpeed)
      }
      
      if (newIntervalId) {
        setIntervalId(newIntervalId)
      }
      setIsAnimating(true)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">QR Animation (Exclusive Feature)</h3>
      <p className="text-xs text-muted-foreground">Create animated QR codes that stand out! Perfect for displays and digital signage.</p>
      
      <div className="grid grid-cols-3 gap-2">
        {animationTypes.map((type) => {
          const Icon = type.icon
          return (
            <Button
              key={type.id}
              variant="outline"
              size="sm"
              onClick={() => toggleAnimation(type.id)}
              className="h-auto py-3 px-2 flex flex-col items-center gap-2"
            >
              <div className="rounded-full p-2 bg-primary/10 text-primary">
                {isAnimating ? <Pause className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className="text-xs">{type.name}</span>
            </Button>
          )
        })}
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-medium">Animation Speed</label>
        <div className="flex items-center gap-2">
          <span className="text-xs">Slow</span>
          <Input 
            type="range" 
            min="500" 
            max="5000" 
            step="100"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-xs">Fast</span>
        </div>
      </div>
      
      {isAnimating && (
        <div className="rounded-md bg-blue-50 dark:bg-blue-950 p-2 text-xs text-blue-700 dark:text-blue-300">
          Your QR code is animating! Use screen recording to capture this unique feature.
        </div>
      )}
    </div>
  )
}
