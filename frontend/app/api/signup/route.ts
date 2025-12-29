import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // 1️⃣ Create user in Auth using service role
    const { data: userData, error: signupError } = await supabaseServer.auth.admin.createUser({
      email,
      password,
    });

    if (signupError || !userData.user) {
      return NextResponse.json({ error: signupError?.message || 'Failed to create user' }, { status: 400 });
    }

    const userId = userData.user.id;

    // 2️⃣ Create profile row
    const { error: profileError } = await supabaseServer
      .from('profiles')
      .insert({ id: userId, created_at: new Date().toISOString() });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Signup and profile creation successful' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
