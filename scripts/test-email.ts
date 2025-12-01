/**
 * Test script to verify Resend API configuration
 * Run with: npx tsx scripts/test-email.ts
 */

import { Resend } from 'resend'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env') })
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

async function testEmail() {
  console.log('🧪 Testing Resend API Configuration...\n')

  // Check environment variables
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

  console.log('📋 Configuration Check:')
  console.log('   RESEND_API_KEY:', apiKey ? `✅ Set (length: ${apiKey.length})` : '❌ Not set')
  console.log('   RESEND_FROM_EMAIL:', fromEmail)
  console.log('')

  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is not configured!')
    console.error('   Please add RESEND_API_KEY to your .env or .env.local file')
    process.exit(1)
  }

  // Initialize Resend
  const resend = new Resend(apiKey)

  // Test email
  const testEmail = 'test@example.com' // Change this to your test email
  console.log('📧 Sending test email to:', testEmail)
  console.log('   From:', fromEmail)
  console.log('')

  try {
    const { data, error } = await resend.emails.send({
      from: `No Man's Land Hotel <${fromEmail}>`,
      to: [testEmail],
      subject: 'Test Email from No Man\'s Land Hotel',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify Resend API configuration.</p>
        <p>If you receive this, your Resend API is working correctly!</p>
      `,
      text: 'This is a test email to verify Resend API configuration.',
    })

    if (error) {
      console.error('❌ Failed to send test email:')
      console.error('   Error:', JSON.stringify(error, null, 2))
      process.exit(1)
    }

    console.log('✅ Test email sent successfully!')
    console.log('   Email ID:', data?.id)
    console.log('   Check your inbox at:', testEmail)
  } catch (error) {
    console.error('❌ Error sending test email:')
    if (error instanceof Error) {
      console.error('   Message:', error.message)
      console.error('   Stack:', error.stack)
    } else {
      console.error('   Error:', error)
    }
    process.exit(1)
  }
}

testEmail()

