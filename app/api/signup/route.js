import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '../../../lib/db'; // Your database connection

export async function POST(request) {
  try {
    const { username, email, password, fieldOfStudy, year } = await request.json();

    // Validate the input fields
    if (!username || !email || !password || !fieldOfStudy || !year) {
        console.log(fieldofstudy, year);
      return NextResponse.json(
        { error: 'Username, email, password, fieldOfStudy, and year are required' },
        { status: 400 }
      );
    }

    // Check if the email is already in use
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const useryear = parseInt(year, 10); // Convert year to an integer
    // Insert the new user into the database (including fos and year)
    await pool.query(
      'INSERT INTO users (username, email, password, fos, year) VALUES ($1, $2, $3, $4, $5)',
      [username, email, hashedPassword, fieldOfStudy, useryear]
    );

    // Respond with success
    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred while registering the user' },
      { status: 500 }
    );
  }
}
