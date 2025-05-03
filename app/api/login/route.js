
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '../../../lib/db';
import { signToken } from '../../../lib/jwt';

export async function POST(request) {
  try {

    const { username, password } = await request.json();
    const email = username;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    // console.log(result);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        
        console.log(bcrypt.compare(password, user.password));
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email });

    const response = NextResponse.json({ message: 'Login successful' ,token },{
        status: 200
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 86400,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
