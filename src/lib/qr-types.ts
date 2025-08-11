import { QRType } from '@/types/qr'

export const QR_TYPES: QRType[] = [
  {
    id: 'url',
    name: 'Website URL',
    icon: 'Globe',
    description: 'Link to any website or webpage',
    fields: [
      {
        name: 'url',
        label: 'Website URL',
        type: 'url',
        placeholder: 'https://example.com',
        required: true,
        validation: (value) => {
          const urlPattern = /^https?:\/\/.+/
          return urlPattern.test(value) ? null : 'Please enter a valid URL starting with http:// or https://'
        }
      }
    ]
  },
  {
    id: 'text',
    name: 'Plain Text',
    icon: 'FileText',
    description: 'Any text content',
    fields: [
      {
        name: 'text',
        label: 'Text Content',
        type: 'textarea',
        placeholder: 'Enter your text here...',
        required: true
      }
    ]
  },
  {
    id: 'email',
    name: 'Email',
    icon: 'Mail',
    description: 'Email address with optional subject and body',
    fields: [
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'user@example.com',
        required: true
      },
      {
        name: 'subject',
        label: 'Subject',
        type: 'text',
        placeholder: 'Email subject (optional)'
      },
      {
        name: 'body',
        label: 'Message',
        type: 'textarea',
        placeholder: 'Email message (optional)'
      }
    ]
  },
  {
    id: 'phone',
    name: 'Phone Number',
    icon: 'Phone',
    description: 'Phone number for direct calling',
    fields: [
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: '+1234567890',
        required: true
      }
    ]
  },
  {
    id: 'sms',
    name: 'SMS Message',
    icon: 'MessageSquare',
    description: 'Send pre-filled SMS message',
    fields: [
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: '+1234567890',
        required: true
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        placeholder: 'Pre-filled SMS message'
      }
    ]
  },
  {
    id: 'wifi',
    name: 'WiFi Network',
    icon: 'Wifi',
    description: 'WiFi network credentials',
    fields: [
      {
        name: 'ssid',
        label: 'Network Name (SSID)',
        type: 'text',
        placeholder: 'My WiFi Network',
        required: true
      },
      {
        name: 'password',
        label: 'Password',
        type: 'text',
        placeholder: 'WiFi password'
      },
      {
        name: 'security',
        label: 'Security Type',
        type: 'select',
        options: ['WPA', 'WEP', 'nopass'],
        required: true
      },
      {
        name: 'hidden',
        label: 'Hidden Network',
        type: 'checkbox'
      }
    ]
  },
  {
    id: 'vcard',
    name: 'Contact Card',
    icon: 'User',
    description: 'Contact information (vCard)',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'John',
        required: true
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Doe'
      },
      {
        name: 'organization',
        label: 'Organization',
        type: 'text',
        placeholder: 'Company Name'
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'tel',
        placeholder: '+1234567890'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'john@example.com'
      },
      {
        name: 'website',
        label: 'Website',
        type: 'url',
        placeholder: 'https://example.com'
      },
      {
        name: 'address',
        label: 'Address',
        type: 'textarea',
        placeholder: '123 Main St, City, State, ZIP'
      }
    ]
  },
  {
    id: 'location',
    name: 'Location',
    icon: 'MapPin',
    description: 'Geographic coordinates',
    fields: [
      {
        name: 'latitude',
        label: 'Latitude',
        type: 'text',
        placeholder: '40.7128',
        required: true,
        validation: (value) => {
          const lat = parseFloat(value)
          return lat >= -90 && lat <= 90 ? null : 'Latitude must be between -90 and 90'
        }
      },
      {
        name: 'longitude',
        label: 'Longitude',
        type: 'text',
        placeholder: '-74.0060',
        required: true,
        validation: (value) => {
          const lng = parseFloat(value)
          return lng >= -180 && lng <= 180 ? null : 'Longitude must be between -180 and 180'
        }
      },
      {
        name: 'query',
        label: 'Location Name',
        type: 'text',
        placeholder: 'New York City (optional)'
      }
    ]
  },
  {
    id: 'calendar',
    name: 'Calendar Event',
    icon: 'Calendar',
    description: 'Add event to calendar',
    fields: [
      {
        name: 'title',
        label: 'Event Title',
        type: 'text',
        placeholder: 'Meeting with team',
        required: true
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Event description'
      },
      {
        name: 'location',
        label: 'Location',
        type: 'text',
        placeholder: 'Conference Room A'
      },
      {
        name: 'startDate',
        label: 'Start Date',
        type: 'text',
        placeholder: 'YYYYMMDD',
        required: true
      },
      {
        name: 'startTime',
        label: 'Start Time',
        type: 'text',
        placeholder: 'HHMMSS'
      },
      {
        name: 'endDate',
        label: 'End Date',
        type: 'text',
        placeholder: 'YYYYMMDD'
      },
      {
        name: 'endTime',
        label: 'End Time',
        type: 'text',
        placeholder: 'HHMMSS'
      }
    ]
  }
]

export function generateQRText(type: string, data: Record<string, string>): string {
  switch (type) {
    case 'url':
      return data.url

    case 'text':
      return data.text

    case 'email':
      const emailParts = [`mailto:${data.email}`]
      if (data.subject || data.body) {
        const params = new URLSearchParams()
        if (data.subject) params.append('subject', data.subject)
        if (data.body) params.append('body', data.body)
        emailParts.push(params.toString())
      }
      return emailParts.join('?')

    case 'phone':
      return `tel:${data.phone}`

    case 'sms':
      return `sms:${data.phone}${data.message ? `?body=${encodeURIComponent(data.message)}` : ''}`

    case 'wifi':
      return `WIFI:T:${data.security};S:${data.ssid};P:${data.password || ''};H:${data.hidden ? 'true' : 'false'};;`

    case 'vcard':
      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${data.firstName} ${data.lastName}`.trim(),
        `N:${data.lastName};${data.firstName};;;`,
        data.organization ? `ORG:${data.organization}` : '',
        data.phone ? `TEL:${data.phone}` : '',
        data.email ? `EMAIL:${data.email}` : '',
        data.website ? `URL:${data.website}` : '',
        data.address ? `ADR:;;${data.address};;;;` : '',
        'END:VCARD'
      ].filter(line => line).join('\n')
      return vcard

    case 'location':
      const lat = data.latitude
      const lng = data.longitude
      const query = data.query ? `,${encodeURIComponent(data.query)}` : ''
      return `geo:${lat},${lng}${query}`

    case 'calendar':
      const event = [
        'BEGIN:VEVENT',
        `SUMMARY:${data.title}`,
        data.description ? `DESCRIPTION:${data.description}` : '',
        data.location ? `LOCATION:${data.location}` : '',
        `DTSTART:${data.startDate}${data.startTime ? `T${data.startTime}` : ''}`,
        data.endDate ? `DTEND:${data.endDate}${data.endTime ? `T${data.endTime}` : ''}` : '',
        'END:VEVENT'
      ].filter(line => line).join('\n')
      return event

    default:
      return data.text || ''
  }
}
