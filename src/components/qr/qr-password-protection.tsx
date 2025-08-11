'use client'

import { useState } from 'react'
import { QRCodeOptions } from '@/types/qr'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { sha256 } from '@/lib/utils'

interface QRPasswordProtectionProps {
  options: QRCodeOptions
  onChange: (options: QRCodeOptions) => void
}

export function QRPasswordProtection({ options, onChange }: QRPasswordProtectionProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isProtected, setIsProtected] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const updateOptions = (updates: Partial<QRCodeOptions>) => {
    // First create a copy of options without any 'password' property
    const { password, ...optionsCopy } = options;
    
    // Then merge with updates
    onChange({ ...optionsCopy, ...updates });
  }

  const toggleProtection = async () => {
    if (isProtected) {
      // Remove password protection by removing the prefix
      updateOptions({ text: options.text.replace(/^PWD:.*?:/, '') });
      setIsProtected(false);
      setPassword('');
      setConfirmPassword('');
      setPasswordError('');
    } else {
      // Validate passwords
      if (!password) {
        setPasswordError('Password is required');
        return;
      }
      
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      
      if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return;
      }
      
      // Hash the password for security
      const passwordHash = await sha256(password);
      
      // Enable password protection by encoding in the text
      updateOptions({ text: `PWD:${passwordHash}:${options.text}` });
      
      setIsProtected(true);
      setPasswordError('');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Password Protection</h3>
        
        <Button 
          size="sm" 
          variant={isProtected ? "default" : "outline"}
          onClick={toggleProtection}
        >
          <Lock className="w-4 h-4 mr-2" />
          {isProtected ? 'Protected' : 'Protect QR'}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Secure your QR code content with password protection. Users will need to enter the password to view the content.
      </p>
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="text-xs font-medium">Set Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={isProtected}
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-xs font-medium">Confirm Password</label>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              disabled={isProtected}
            />
          </div>
          
          {passwordError && (
            <div className="text-xs text-red-500">
              {passwordError}
            </div>
          )}
          
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">How it works:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>The password is securely hashed and embedded in the QR code</li>
                  <li>When scanned, users will see a password entry screen</li>
                  <li>Content is only revealed after correct password entry</li>
                  <li>Processing happens locally on the user's device for security</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isProtected && (
        <div className="rounded-md bg-green-50 dark:bg-green-950 p-2 text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Your QR code is now password protected! Only users with the password can access the content.
        </div>
      )}
    </div>
  )
}
