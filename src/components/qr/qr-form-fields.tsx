'use client'

import { useState, useEffect } from 'react'
import { QR_TYPES } from '@/lib/qr-types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'

interface QRFormFieldsProps {
  type: string
  data: Record<string, string>
  onChange: (data: Record<string, string>) => void
}

export function QRFormFields({ type, data, onChange }: QRFormFieldsProps) {
  const [formData, setFormData] = useState<Record<string, string>>(data)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const qrType = QR_TYPES.find(t => t.id === type)

  useEffect(() => {
    setFormData(data)
    setErrors({})
  }, [type, data])

  const handleFieldChange = (fieldName: string, value: string) => {
    const newData = { ...formData, [fieldName]: value }
    setFormData(newData)

    // Validate field if it has validation
    const field = qrType?.fields.find(f => f.name === fieldName)
    if (field?.validation) {
      try {
        const error = field.validation(value)
        setErrors(prev => ({
          ...prev,
          [fieldName]: error || ''
        }))
      } catch (validationError) {
        console.error('Validation error:', validationError)
        setErrors(prev => ({
          ...prev,
          [fieldName]: 'Validation failed'
        }))
      }
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }

    // Notify parent with delay to prevent excessive updates
    setTimeout(() => onChange(newData), 0)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData(prev => ({
            ...prev,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6)
          }))
          onChange({
            ...formData,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6)
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your location. Please enter coordinates manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  if (!qrType) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{qrType.icon}</span>
        <div>
          <h3 className="font-semibold">{qrType.name}</h3>
          <p className="text-sm text-muted-foreground">{qrType.description}</p>
        </div>
      </div>

      {qrType.fields.map((field) => {
        const fieldValue = formData[field.name] || ''
        const fieldError = errors[field.name]

        return (
          <div key={field.name} className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <Textarea
                placeholder={field.placeholder}
                value={fieldValue}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className={fieldError ? 'border-red-500' : ''}
              />
            ) : field.type === 'select' ? (
              <select
                value={fieldValue}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={fieldValue === 'true'}
                  onChange={(e) => handleFieldChange(field.name, e.target.checked.toString())}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{field.placeholder || field.label}</span>
              </label>
            ) : (
              <div className="flex gap-2">
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={fieldValue}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className={fieldError ? 'border-red-500' : ''}
                />
                {type === 'location' && field.name === 'latitude' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    className="whitespace-nowrap flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    Get Current
                  </Button>
                )}
              </div>
            )}

            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
