'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CopyIcon, X } from 'lucide-react'
import { useToast } from '@/components/ui/toaster'
import { QRCodeGenerator } from '@/lib/qr-generator'
import Image from 'next/image'

export function DonationDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('')
  const { toast } = useToast()

  // Hardcoded Polygon wallet address
  const polygonAddress = '0x742d35Cc6862C02180E26c14b550c57b6d5C85C8'

  useEffect(() => {
    if (isOpen && !qrCodeDataURL) {
      generateQRCode()
    }
    
    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, qrCodeDataURL])

  const generateQRCode = async () => {
    try {
      const qrOptions = {
        text: polygonAddress,
        size: 200,
        margin: 4,
        errorCorrectionLevel: 'M' as const,
        foregroundColor: '#000000',
        backgroundColor: '#ffffff',
        cornerSquareStyle: 'square' as const,
        cornerDotStyle: 'square' as const
      }
      
      const dataURL = await QRCodeGenerator.generateQRCode(qrOptions)
      setQrCodeDataURL(dataURL)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Address Copied',
      description: 'Polygon wallet address copied to clipboard',
    })
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="group text-sm font-medium transition-colors hover:text-primary"
      >
        Support Project
      </Button>

      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000, // Increased z-index to be higher than header
            padding: '1rem'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false)
            }
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '100%',
              maxWidth: '28rem',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative' // Ensure proper stacking context
            }}
            className="dark:bg-gray-800"
          >
            <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Support OpenQR Project</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}
                >
                  <X style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'gray', marginTop: '0.5rem' }}>
                You can donate to support the development of OpenQR using cryptocurrency on the Polygon network.
              </p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '500', margin: 0 }}>Polygon (MATIC)</h4>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    backgroundColor: '#ede9fe', 
                    color: '#6d28d9',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px'
                  }}>
                    Crypto Donation
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}>
                  <div style={{ 
                    width: '12rem', 
                    height: '12rem', 
                    backgroundColor: 'white', 
                    borderRadius: '0.5rem',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {qrCodeDataURL ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image 
                          src={qrCodeDataURL}
                          alt="Polygon Donation QR Code"
                          width={200}
                          height={200}
                          style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
                        />
                      </div>
                    ) : (
                      <div>Generating QR code...</div>
                    )}
                  </div>
                </div>
                <div style={{ position: 'relative', marginTop: '0.75rem' }}>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    backgroundColor: '#f3f4f6', 
                    padding: '0.5rem', 
                    borderRadius: '0.375rem',
                    wordBreak: 'break-all',
                    marginBottom: '0.5rem'
                  }}>
                    {polygonAddress}
                  </p>
                  <button
                    onClick={() => copyToClipboard(polygonAddress)}
                    style={{
                      position: 'absolute',
                      right: '0.25rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.375rem'
                    }}
                  >
                    <CopyIcon style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'gray', marginTop: '0.5rem' }}>
                  Only send MATIC or other Polygon-based tokens to this address
                </p>
              </div>
            </div>
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'gray' }}>
                Thank you for supporting open source software!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
