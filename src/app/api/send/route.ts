import { EmailTemplate } from '@/components/email-template';
import { contactUsFormSchema } from '@/lib/validation/contactUsFormSchema';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { name, email, subject, message } =
      contactUsFormSchema.parse(body);

    // Send the email using Resend
    const data = await resend.emails.send({
      from: 'Test <onboarding@resend.dev>', // Replace with your actual sender email if necessary
      to: ['jsuntha56@gmail.com'], // Your recipient email
      subject: subject,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      react: EmailTemplate({ name: name, message: message }) // Use the React email template
    });

    // Return success response
    return NextResponse.json(
      {
        message: 'Email sent successfully!',
        data: data
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle errors and return failure response
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        message: 'Failed to send email',
        error: error
      },
      { status: 500 }
    );
  }
}
