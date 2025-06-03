// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user, token } = req.body;
     res.setHeader("Set-Cookie", [
      `token=${token}; Path=/; HttpOnly; SameSite=Lax`,
      `userName=${encodeURIComponent(user.displayName)}; Path=/; SameSite=Lax`,
      `userId='${user.uid}; Path=/; SameSite=Lax`,
    ]);
    res.status(200).json({ message: "Login berhasil", user });
  } catch (err) {
    console.error("Login gagal:", err);
  }
}
