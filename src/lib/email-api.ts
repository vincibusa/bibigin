// Email API service for calling gestionale email endpoints

interface EmailAPIResponse {
  success: boolean
  message: string
  error?: string
  details?: {
    customerEmail: {
      success: boolean
      error: string | null
    }
    adminEmail: {
      success: boolean
      error: string | null
    }
  }
}

interface OrderEmailData {
  orderId: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
}

const GESTIONALE_BASE_URL = process.env.NEXT_PUBLIC_GESTIONALE_URL || 'http://localhost:3002'

/**
 * Send both customer confirmation and admin notification emails for an order
 */
export async function sendOrderEmails(data: OrderEmailData): Promise<EmailAPIResponse> {
  try {
    const response = await fetch(`${GESTIONALE_BASE_URL}/api/emails/send-order-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send emails')
    }

    return result
  } catch (error) {
    console.error('Error calling email API:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to send order emails')
  }
}

/**
 * Send only customer confirmation email
 */
export async function sendCustomerConfirmationEmail(data: OrderEmailData): Promise<EmailAPIResponse> {
  try {
    const response = await fetch(`${GESTIONALE_BASE_URL}/api/emails/order-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send customer confirmation email')
    }

    return result
  } catch (error) {
    console.error('Error calling customer email API:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to send customer confirmation email')
  }
}

/**
 * Send only admin notification email
 */
export async function sendAdminNotificationEmail(data: OrderEmailData): Promise<EmailAPIResponse> {
  try {
    const response = await fetch(`${GESTIONALE_BASE_URL}/api/emails/admin-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send admin notification email')
    }

    return result
  } catch (error) {
    console.error('Error calling admin email API:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to send admin notification email')
  }
}