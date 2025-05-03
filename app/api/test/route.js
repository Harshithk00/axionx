import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import pool from '@/lib/db'; // Assume client is your PostgreSQL client

export async function POST(req) {
  try {
    
    const token = req.cookies.get('token')?.value;
    console.log(token);
    if (!token) {
      return NextResponse.json({ message: 'Authorization token is required' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    const body = await req.json();
    const { score, weakTopics, scores } = body;
    const userId = decoded.email;
    console.log(userId, score, weakTopics, scores);

    const query = `
      UPDATE users
      SET score = $1, weakTopics = $2
      WHERE email = $3
      RETURNING *;
    `;

    const values = [score, weakTopics, userId];
    const result = await pool.query(query, values);
    // console.log(result);

    updateScores(userId, score);
    

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'User not found or no update made' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Score updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}



async function updateScores(email, newScore) {
    try {
      // 1. Get current scores from DB
      const { rows } = await pool.query(
        `SELECT scores FROM users WHERE email = $1`,
        [email]
      );
  
      if (rows.length === 0) {
        throw new Error('User not found');
      }
  
      let scores = [];
  
      try {
        scores = JSON.parse(rows[0].scores || '[]'); // Stored as array of objects
      } catch (err) {
        console.warn('Could not parse scores, using empty array.');
      }
  
      // 2. Get current month
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const now = new Date();
      const month = monthNames[now.getMonth()];
  
      // 3. Add new score with month
      scores.push({ "month":month,"score": newScore });
  
      // 4. Limit to last 10 entries
      if (scores.length > 10) {
        scores.shift();
      }
  
      // 5. Update DB
      const updateQuery = `
        UPDATE users
        SET scores = $1
        WHERE email = $2
      `;
  
      await pool.query(updateQuery, [JSON.stringify(scores), email]);
  
      return { success: true, scores };
    } catch (err) {
      console.error('Error updating scores:', err);
      return { success: false, error: err.message };
    }
  }
  