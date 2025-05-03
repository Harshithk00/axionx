import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;


export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '24h' });
}

export async function verifyToken(token) {
  try {
    // console.log('token',token);
    const data = await jwt.verify(token, SECRET);
    console.log('data',data);
    return data;
  } catch (err) {
    return null;
  }
}
