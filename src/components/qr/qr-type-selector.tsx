'use client'

import React from 'react'
import { QR_TYPES } from '@/lib/qr-types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Globe, 
  FileText, 
  Mail, 
  Phone, 
  MessageSquare, 
  Wifi, 
  User, 
  MapPin, 
  Calendar 
} from 'lucide-react'

// Icon mapping for QR types
const getIcon = (iconName: string) => {
  const iconMap = {
    Globe,
    FileText,
    Mail,
    Phone,
    MessageSquare,
    Wifi,
    User,
    MapPin,
    Calendar
  } as Record<string, React.ComponentType<{className: string}>>
  
  const IconComponent = iconMap[iconName]
  return IconComponent ? <IconComponent className="w-5 h-5" /> : <FileText className="w-5 h-5" />
}

interface QRTypeSelectorProps {
  selectedType: string
  onTypeChange: (type: string) => void
}

export function QRTypeSelector({ selectedType, onTypeChange }: QRTypeSelectorProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-3 block">QR Code Type</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[320px] overflow-y-auto p-1 rounded-md">
        {QR_TYPES.map((type) => (
          <Button
            key={type.id}
            variant={selectedType === type.id ? 'default' : 'outline'}
            onClick={() => onTypeChange(type.id)}
            className={cn(
              "h-auto py-3 px-2 flex flex-col items-center gap-2 text-center",
              selectedType === type.id 
                ? "ring-2 ring-primary ring-offset-2 bg-primary/10 text-primary" 
                : "hover:bg-primary/5"
            )}
          >
            <div className={cn(
              "rounded-full p-2",
              selectedType === type.id 
                ? "bg-primary/20 text-primary" 
                : "bg-muted text-muted-foreground"
            )}>
              {getIcon(type.icon)}
            </div>
            <div className="font-medium text-sm">{type.name}</div>
          </Button>
        ))}
      </div>
    </div>
  )
}
