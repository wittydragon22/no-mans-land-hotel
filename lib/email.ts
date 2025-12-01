/**
 * Email service for sending confirmation codes and notifications
 * Using Resend API for email delivery
 */

import { Resend } from 'resend'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Get or create Resend client instance
 * Initialize lazily to ensure environment variables are loaded
 */
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return null
  }
  return new Resend(apiKey)
}

/**
 * Send an email using Resend API
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    // Check if API key is configured
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('⚠️  RESEND_API_KEY not configured. Email will not be sent.')
      console.log('📧 Email would be sent:')
      console.log('To:', options.to)
      console.log('Subject:', options.subject)
      console.log('📝 To fix: Add RESEND_API_KEY to your .env file')
      return false
    }

    // Initialize Resend client with current API key
    const resend = getResendClient()
    if (!resend) {
      console.error('❌ Failed to initialize Resend client')
      return false
    }

    // Get sender email from environment or use default
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    
    console.log('📧 Attempting to send email via Resend...')
    console.log('   From:', fromEmail)
    console.log('   To:', options.to)
    console.log('   Subject:', options.subject)
    console.log('   API Key configured:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No')
    
    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `No Man's Land Hotel <${fromEmail}>`,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    })

    if (error) {
      console.error('❌ Failed to send email via Resend:', error)
      console.error('   Error details:', JSON.stringify(error, null, 2))
      return false
    }

    console.log('✅ Email sent successfully via Resend!')
    console.log('   Email ID:', data?.id)
    console.log('   To:', options.to)
    return true
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    if (error instanceof Error) {
      console.error('   Error message:', error.message)
      console.error('   Error stack:', error.stack)
    }
    return false
  }
}

/**
 * Send booking confirmation code email with digital key
 */
export async function sendConfirmationCodeEmail(
  email: string,
  confirmationCode: string,
  reservationId: string,
  guestName: string,
  checkInDate: Date,
  checkOutDate: Date,
  roomNumber: string,
  digitalKeyToken?: string,
  digitalKeyExpiresAt?: Date
): Promise<boolean> {
  const subject = 'Your Booking Confirmation Code'
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .code-box { background: white; border: 2px dashed #1a1a1a; padding: 20px; text-align: center; margin: 20px 0; }
          .confirmation-code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1a1a1a; }
          .info { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #1a1a1a; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>No Man's Land Hotel</h1>
            <p>Booking Confirmation</p>
          </div>
          <div class="content">
            <h2>Hello ${guestName},</h2>
            <p>Thank you for your booking! Your reservation has been confirmed.</p>
            
            <div class="code-box">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your Confirmation Code</p>
              <div class="confirmation-code">${confirmationCode}</div>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Use this code for check-in</p>
            </div>
            
            <div class="info">
              <p><strong>Reservation ID:</strong> ${reservationId}</p>
              <p><strong>Room:</strong> ${roomNumber}</p>
              <p><strong>Check-in:</strong> ${checkInDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Check-out:</strong> ${checkOutDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            ${digitalKeyToken ? `
            <div class="code-box" style="margin-top: 20px;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your Digital Key Token</p>
              <div class="confirmation-code" style="font-size: 24px; word-break: break-all;">${digitalKeyToken}</div>
              ${digitalKeyExpiresAt ? `<p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Expires: ${digitalKeyExpiresAt.toLocaleString('en-US')}</p>` : ''}
            </div>
            ` : ''}
            
            <p>Please keep this confirmation code and digital key safe. You'll need them when you check in.</p>
            <p>If you have any questions, please contact us.</p>
          </div>
          <div class="footer">
            <p>No Man's Land Hotel | Automated Check-In System</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `
  
  const text = `
No Man's Land Hotel - Booking Confirmation

Hello ${guestName},

Thank you for your booking! Your reservation has been confirmed.

Your Confirmation Code: ${confirmationCode}

Reservation Details:
- Reservation ID: ${reservationId}
- Room: ${roomNumber}
- Check-in: ${checkInDate.toLocaleDateString('en-US')}
- Check-out: ${checkOutDate.toLocaleDateString('en-US')}
${digitalKeyToken ? `
- Digital Key Token: ${digitalKeyToken}
${digitalKeyExpiresAt ? `- Key Expires: ${digitalKeyExpiresAt.toLocaleString('en-US')}` : ''}
` : ''}

Please keep this confirmation code${digitalKeyToken ? ' and digital key' : ''} safe. You'll need ${digitalKeyToken ? 'them' : 'it'} when you check in.

If you have any questions, please contact us.

No Man's Land Hotel | Automated Check-In System
  `
  
  return sendEmail({
    to: email,
    subject,
    html,
    text,
  })
}

