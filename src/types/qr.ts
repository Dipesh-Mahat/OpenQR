export interface QRCodeOptions {
  text: string
  size: number
  margin: number
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  foregroundColor: string
  backgroundColor: string
  logoUrl?: string
  logoSize?: number
  cornerSquareStyle: 'square' | 'dot' | 'extra-rounded'
  cornerDotStyle: 'square' | 'dot'
  gradient?: {
    type: 'linear' | 'radial'
    rotation: number
    colorStops: Array<{ offset: number; color: string }>
  }
  frame?: {
    style: 'square' | 'rounded' | 'circle' | 'banner'
    color: string
    text?: string
    textColor?: string
  }
  // New features
  animation?: {
    enabled: boolean
    type: 'color-pulse' | 'gradient-shift' | 'pattern-morph'
    speed: number
  }
  arContent?: {
    enabled: boolean
    type: 'image' | 'video' | '3d'
    url: string
    displayMode: 'popup' | 'fullscreen' | 'embedded'
  }
  smartConditions?: {
    enabled: boolean
    type: string
    conditions: any
  }
  password?: {
    enabled: boolean
    hash: string
  }
}

export interface QRTemplate {
  id: string
  name: string
  description: string
  category: string
  options: Partial<QRCodeOptions>
  preview: string
}

export interface AnalyticsData {
  totalScans: number
  uniqueScans: number
  scansByDate: Array<{ date: string; scans: number }>
  scansByLocation: Array<{ country: string; scans: number }>
  scansByDevice: Array<{ device: string; scans: number }>
  topQRCodes: Array<{ id: string; title: string; scans: number }>
}

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'jpg'
  size: number
  quality?: number
  transparent?: boolean
}

export interface BulkQRItem {
  id: string
  text: string
  filename?: string
  options?: Partial<QRCodeOptions>
}

export interface ScanResult {
  text: string
  format: string
  timestamp: number
  location?: GeolocationPosition
}
