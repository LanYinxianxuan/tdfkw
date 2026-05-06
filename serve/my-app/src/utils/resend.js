import { Resend } from 'resend'

export function getResend(c) {
  return new Resend(c.env.RESEND_API_KEY)
}
