'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'

interface QRFormFieldsProps {
  type?: string // Made optional since we'll only have one type
  data: Record<string, string>
  onChange: (data: Record<string, string>) => void
}

export function QRFormFields({ data, onChange }: QRFormFieldsProps) {
  const [formData, setFormData] = useState<Record<string, string>>(data)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setFormData(data)
    setError('')
  }, [data])

  const handleChange = (value: string) => {
    // Validate input
    if (!value.trim()) {
      setError('Text is required')
    } else {
      setError('')
    }

    const newData = { ...formData, text: value }
    setFormData(newData)

    // Notify parent with delay to prevent excessive updates
    setTimeout(() => onChange(newData), 0)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📝</span>
        <div>
          <h3 className="font-semibold">QR Code Content</h3>
          <p className="text-sm text-muted-foreground">Enter the text you want to encode in your QR code</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-1">
          Text Content
          <span className="text-red-500">*</span>
        </label>
        
        <Textarea
          placeholder="Enter your text here"
          value={formData.text || ''}
          onChange={(e) => handleChange(e.target.value)}
          className={error ? 'border-red-500' : ''}
        />

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  )
}
