"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { createSession, destroySession } from "@/lib/session";

const LoginSchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  password: z.string().min(1, "Mot de passe requis"),
  next: z.string().optional(),
});

export type LoginState = { error?: string } | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    username: formData.get("username") || undefined,
    password: formData.get("password") || undefined,
    next: formData.get("next") || undefined,
  });

  if (!parsed.success) {
    return { error: "Veuillez remplir tous les champs." };
  }

  await connectDB();
  const user = await User.findOne({ username: parsed.data.username }).lean();

  const valid =
    user && (await bcrypt.compare(parsed.data.password, user.passwordHash));

  if (!valid) {
    return { error: "Nom d'utilisateur ou mot de passe incorrect." };
  }

  if (user.role !== "admin") {
    return { error: "Accès réservé aux administrateurs." };
  }

  await createSession(user._id.toString(), "admin");

  const next = parsed.data.next;
  redirect(next && next.startsWith("/") ? next : "/admin");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
