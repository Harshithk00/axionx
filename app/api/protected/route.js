import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/jwt';

export async function GET(request) {
  const token = request.cookies.get('token')?.value;
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ message: `Hello, ${user.email}` });
}
