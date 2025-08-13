'use client'

import { useState } from 'react'
import { QRCodeOptions } from '@/types/qr'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Clock, 
  MapPin, 
  User, 
  Languages,
  Sun,
  Moon
} from 'lucide-react'

interface QRSmartConditionsProps {
  options: QRCodeOptions
  onChange: (options: QRCodeOptions) => void
}

export function QRSmartConditions({ options, onChange }: QRSmartConditionsProps) {
  const [conditionType, setConditionType] = useState<string>('time')
  const [smartEnabled, setSmartEnabled] = useState(false)
  const [conditions, setConditions] = useState({
    time: {
      startTime: '09:00',
      endTime: '17:00',
      redirectUrl: ''
    },
    location: {
      countries: ['US'],
      redirectUrl: ''
    },
    language: {
      languages: ['en'],
      redirectUrls: { en: '' } as Record<string, string>
    },
    darkMode: {
      lightModeUrl: '',
      darkModeUrl: ''
    }
  })

  const updateOptions = (updates: Partial<QRCodeOptions>) => {
    onChange({ ...options, ...updates })
  }

  const conditionTypes = [
    { id: 'time', name: 'Time-Based', icon: Clock },
    { id: 'location', name: 'Location', icon: MapPin },
    { id: 'language', name: 'Language', icon: Languages },
    { id: 'darkMode', name: 'Dark Mode', icon: Moon },
  ]

  const updateCondition = (type: string, data: any) => {
    const newConditions = {
      ...conditions,
      [type]: {
        ...conditions[type as keyof typeof conditions],
        ...data
      }
    }
    
    setConditions(newConditions)
    
    // Update QR options with smart conditions by creating a URL to our smart.html page
    if (smartEnabled) {
      // Create the condition data in the format: SMART:conditionType:defaultURL:conditionsJSON
      const conditionsJSON = JSON.stringify(newConditions[conditionType as keyof typeof conditions]);
      const conditionData = `SMART:${conditionType}:${options.text}:${conditionsJSON}`;
      
      // Encode the data and create a URL to our smart.html page
      const encodedData = encodeURIComponent(btoa(conditionData));
      const smartUrl = `${window.location.origin}/smart.html?data=${encodedData}`;
      
      updateOptions({ text: smartUrl });
    }
  }

  const toggleSmartQR = () => {
    const newState = !smartEnabled
    setSmartEnabled(newState)
    
    if (newState) {
      // Enable smart QR functionality by creating a URL to our smart.html page
      const conditionsJSON = JSON.stringify(conditions[conditionType as keyof typeof conditions]);
      const conditionData = `SMART:${conditionType}:${options.text}:${conditionsJSON}`;
      
      // Encode the data and create a URL to our smart.html page
      const encodedData = encodeURIComponent(btoa(conditionData));
      const smartUrl = `${window.location.origin}/smart.html?data=${encodedData}`;
      
      updateOptions({ text: smartUrl });
    } else {
      // Try to extract the original URL from the smart URL
      try {
        const url = new URL(options.text);
        if (url.pathname === '/smart.html') {
          const data = url.searchParams.get('data');
          if (data) {
            const decodedData = atob(decodeURIComponent(data));
            const [prefix, type, originalUrl] = decodedData.split(':');
            if (prefix === 'SMART' && originalUrl) {
              updateOptions({ text: originalUrl });
            }
          }
        } else {
          // Not a smart URL, no changes needed
        }
      } catch (e) {
        // Invalid URL, no changes needed
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Smart QR Conditions</h3>
        
        <Button 
          size="sm" 
          variant={smartEnabled ? "default" : "outline"}
          onClick={toggleSmartQR}
        >
          {smartEnabled ? 'Enabled' : 'Enable Smart QR'}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Create dynamic QR codes that change behavior based on conditions like time, location, or user preferences.
      </p>
      
      <div className="grid grid-cols-2 gap-1">
        {conditionTypes.map((type) => {
          const Icon = type.icon
          return (
            <Button
              key={type.id}
              variant={conditionType === type.id ? 'default' : 'outline'}
              onClick={() => setConditionType(type.id)}
              className="h-auto py-2 px-2 flex flex-col items-center gap-1"
            >
              <div className={`rounded-full p-1 ${conditionType === type.id ? 'bg-white text-primary' : 'bg-primary/10 text-primary'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs">{type.name}</span>
            </Button>
          )
        })}
      </div>
      
      <Card>
        <CardContent className="pt-4 px-3 space-y-3">
          {conditionType === 'time' && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Redirect to different URLs based on the time of day when scanned
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium">Start Time</label>
                  <Input
                    type="time"
                    value={conditions.time.startTime}
                    onChange={(e) => updateCondition('time', { startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">End Time</label>
                  <Input
                    type="time"
                    value={conditions.time.endTime}
                    onChange={(e) => updateCondition('time', { endTime: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium">Redirect URL (During Hours)</label>
                <Input
                  type="url"
                  placeholder="https://example.com/day"
                  value={conditions.time.redirectUrl}
                  onChange={(e) => updateCondition('time', { redirectUrl: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-xs font-medium">Default URL (Outside Hours)</label>
                <Input
                  type="url"
                  placeholder="https://example.com/closed"
                  value={options.text}
                  onChange={(e) => updateOptions({ text: e.target.value })}
                />
              </div>
            </div>
          )}
          
          {conditionType === 'darkMode' && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Show different content based on the user's light/dark mode preference
              </p>
              
              <div>
                <label className="flex items-center gap-2 text-xs font-medium">
                  <Sun className="w-4 h-4" /> Light Mode URL
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/light"
                  value={conditions.darkMode.lightModeUrl}
                  onChange={(e) => updateCondition('darkMode', { lightModeUrl: e.target.value })}
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-xs font-medium">
                  <Moon className="w-4 h-4" /> Dark Mode URL
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/dark"
                  value={conditions.darkMode.darkModeUrl}
                  onChange={(e) => updateCondition('darkMode', { darkModeUrl: e.target.value })}
                />
              </div>
            </div>
          )}
          
          {conditionType === 'location' && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Redirect to different URLs based on the user's country
              </p>
              
              <div>
                <label className="text-xs font-medium">Target Country</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={conditions.location.countries[0]}
                  onChange={(e) => updateCondition('location', { countries: [e.target.value] })}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="other">Other Countries</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-medium">Redirect URL (Target Country)</label>
                <Input
                  type="url"
                  placeholder="https://example.com/us"
                  value={conditions.location.redirectUrl}
                  onChange={(e) => updateCondition('location', { redirectUrl: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-xs font-medium">Default URL (Other Countries)</label>
                <Input
                  type="url"
                  placeholder="https://example.com/international"
                  value={options.text}
                  onChange={(e) => updateOptions({ text: e.target.value })}
                />
              </div>
            </div>
          )}
          
          {conditionType === 'language' && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Redirect to different URLs based on the user's browser language
              </p>
              
              <div>
                <label className="text-xs font-medium">Primary Language</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={conditions.language.languages[0]}
                  onChange={(e) => {
                    const lang = e.target.value;
                    updateCondition('language', { 
                      languages: [lang],
                      redirectUrls: {
                        ...conditions.language.redirectUrls,
                        [lang]: conditions.language.redirectUrls[lang] || ''
                      }
                    })
                  }}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-medium">URL for Selected Language</label>
                <Input
                  type="url"
                  placeholder={`https://example.com/${conditions.language.languages[0]}`}
                  value={conditions.language.redirectUrls[conditions.language.languages[0]] || ''}
                  onChange={(e) => {
                    const lang = conditions.language.languages[0];
                    updateCondition('language', { 
                      redirectUrls: {
                        ...conditions.language.redirectUrls,
                        [lang]: e.target.value
                      }
                    })
                  }}
                />
              </div>
              
              <div>
                <label className="text-xs font-medium">Default URL (Other Languages)</label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={options.text}
                  onChange={(e) => updateOptions({ text: e.target.value })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {smartEnabled && (
        <div className="rounded-md bg-green-50 dark:bg-green-950 p-2 text-xs text-green-700 dark:text-green-300">
          Smart QR activated! Your QR code will behave differently based on {conditionType} conditions.
        </div>
      )}
    </div>
  )
}
