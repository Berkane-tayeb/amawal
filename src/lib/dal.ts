import "server-only";
import { cache } from "react";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/session";
import { User } from "@/lib/models/user";

export type SessionUser = {
  userId: string;
  username: string;
  role: "admin" | "user";
};

export const verifySession = cache(async (): Promise<SessionUser | null> => {
  const session = await getSession();
  if (!session?.userId) return null;

  await connectDB();
  const user = await User.findById(session.userId).lean();
  if (!user) return null;

  return {
    userId: user._id.toString(),
    username: user.username,
    role: user.role,
  };
});

export async function requireAdmin(): Promise<SessionUser> {
  const user = await verifySession();
  if (!user || user.role !== "admin") {
    throw new Error("Accès refusé : administrateur requis.");
  }
  return user;
}
