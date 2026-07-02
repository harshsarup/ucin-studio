import { api } from './config'

export interface ContactPayload {
  name: string
  email: string
  company?: string
  message: string
  topic?: string
}

/** Send an enquiry — the backend emails the team via SES (POST /customer/contact). */
export async function sendContact(p: ContactPayload): Promise<void> {
  await api.post('/customer/contact', p)
}
