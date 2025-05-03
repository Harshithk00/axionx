// lib/session.js
export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "my-app-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
