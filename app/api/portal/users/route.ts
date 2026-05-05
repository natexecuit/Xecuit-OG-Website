import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, createUser, deleteUser, getUserByEmail } from '@/lib/portal/storage';
import { hashPassword, getSession, isAdminSession } from '@/lib/portal/auth';
import { Resend } from 'resend';
import { generateInviteEmail, generateInviteEmailText } from '@/lib/portal/email-template';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// GET - List all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const adminSessionToken = request.cookies.get('portal-admin-session')?.value;
    if (!adminSessionToken || !isAdminSession(adminSessionToken)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const users = getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('[Get Users Error]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const adminSessionToken = request.cookies.get('portal-admin-session')?.value;
    if (!adminSessionToken || !isAdminSession(adminSessionToken)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, password, autoGeneratePassword } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate password if requested or not provided
    const finalPassword = autoGeneratePassword || !password
      ? `XC-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      : password;

    if (!finalPassword || finalPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create user
    const passwordHash = hashPassword(finalPassword);
    const user = createUser(email, passwordHash);

    // Send invite email
    let emailSent = false;
    let emailError = null;

    if (resend) {
      try {
        const { error } = await resend.emails.send({
          from: 'Xecuit Portal <portal@xecuit.com>',
          to: email,
          subject: 'Xecuit Counterparty Access Portal - Your Access Credentials',
          html: generateInviteEmail({
            recipientEmail: email,
            password: finalPassword,
            portalUrl: 'https://xecuit.com/portal',
          }),
          text: generateInviteEmailText({
            recipientEmail: email,
            password: finalPassword,
            portalUrl: 'https://xecuit.com/portal',
          }),
        });

        if (error) {
          emailError = error.message;
          console.error('[Email Send Error]', error);
        } else {
          emailSent = true;
        }
      } catch (e) {
        emailError = 'Failed to send email';
        console.error('[Email Send Exception]', e);
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
      },
      password: finalPassword, // Return password for display if email fails
      emailSent,
      emailError,
    });
  } catch (error: any) {
    console.error('[Create User Error]', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const adminSessionToken = request.cookies.get('portal-admin-session')?.value;
    if (!adminSessionToken || !isAdminSession(adminSessionToken)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const deleted = deleteUser(email);
    if (!deleted) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('[Delete User Error]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
