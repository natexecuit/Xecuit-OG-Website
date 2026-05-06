import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUserPassword } from '@/lib/portal/storage';
import { hashPassword, isAdminSession } from '@/lib/portal/auth';

// PATCH - Update user password (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const adminSessionToken = request.cookies.get('portal-admin-session')?.value;
    if (!adminSessionToken || !isAdminSession(adminSessionToken)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId } = await params;
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash the new password
    const passwordHash = hashPassword(password);

    // Update the password
    const updated = await updateUserPassword(userId, password, passwordHash);

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error: any) {
    console.error('[Update Password Error]', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
