import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Remove the authentication cookie (example: 'token')
  res.setHeader("Set-Cookie", [
    "token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax",
    "userName=; Path=/; Max-Age=0; SameSite=Lax",
    "userId=; Path=/; Max-Age=0; SameSite=Lax",
  ]);
  res.status(200).json({ message: "Signed out successfully" });
}
