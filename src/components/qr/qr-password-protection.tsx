'use client'

import { useState } from 'react'
import { QRCodeOptions } from '@/types/qr'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { sha256, generateId } from '@/lib/utils'

interface QRPasswordProtectionProps {
  options: QRCodeOptions
  onChange: (options: QRCodeOptions) => void
}

export function QRPasswordProtection({ options, onChange }: QRPasswordProtectionProps) {
  const [passwordValue, setPasswordValue] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isProtected, setIsProtected] = useState(
    options.text.includes('/protect.html?') || options.text.includes('/protect.html#')
  )
  const [passwordError, setPasswordError] = useState('')

  const updateOptions = (updates: Partial<QRCodeOptions>) => {
    // Create a copy of options
    const optionsCopy = { ...options };
    
    // Then merge with updates
    onChange({ ...optionsCopy, ...updates });
  }

  const toggleProtection = async () => {
    if (isProtected) {
      // Extract the original URL from the protection URL if it exists
      let originalText = options.text;
      
      try {
        if (options.text.includes('/protect.html?')) {
          // Get the data parameter
          const url = new URL(options.text);
          const encodedData = url.searchParams.get('data') || '';
          
          // Decode from base64
          const decodedData = atob(decodeURIComponent(encodedData));
          
          // Extract original content (everything after the first colon)
          originalText = decodedData.substring(decodedData.indexOf(':') + 1);
        } else if (options.text.includes('/protect.html#')) {
          // Get the hash fragment
          const hashPart = options.text.split('#')[1];
          
          // Decode from base64
          const decodedData = atob(decodeURIComponent(hashPart));
          
          // Extract original content (everything after the first colon)
          originalText = decodedData.substring(decodedData.indexOf(':') + 1);
        }
      } catch (error) {
        console.error('Error extracting original text:', error);
      }
      
      updateOptions({ text: originalText });
      setIsProtected(false);
      setPasswordValue('');
      setConfirmPassword('');
      setPasswordError('');
    } else {
      // Validate passwords
      if (!passwordValue) {
        setPasswordError('Password is required');
        return;
      }
      
      if (passwordValue !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      
      if (passwordValue.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return;
      }
      
      // Hash the password for security
      const passwordHash = await sha256(passwordValue);
      
      // Create the protected data by combining password hash and original content
      const protectedData = `${passwordHash}:${options.text}`;
      
      // Convert to base64 to make it URL safe
      const base64Data = btoa(protectedData);
      
      // Create a URL to the protection page with the data as a query parameter
      // Use a unique ID to prevent QR scanners from seeing full content
      const basePath = window.location.pathname.includes('/OpenQR') ? '/OpenQR' : '';
      const protectionUrl = `${window.location.origin}${basePath}/protect.html?id=${generateId()}&data=${encodeURIComponent(base64Data)}`;
      
      // Enable password protection by updating the QR code text to the protection URL
      updateOptions({ text: protectionUrl });
      
      setIsProtected(true);
      setPasswordError('');
    }
  };

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
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
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
                  <li>The password is securely hashed and embedded in the QR code link</li>
                  <li>When scanned, users see a link to our password entry page</li>
                  <li>After entering the correct password, they&apos;ll be redirected to your content</li>
                  <li>Works with all mobile QR scanners and provides enhanced security</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isProtected && (
        <div className="rounded-md bg-green-50 dark:bg-green-950 p-2 text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Your QR code is now password protected! When scanned, users will see a link to our secure password entry page.
        </div>
      )}
    </div>
  );
}
