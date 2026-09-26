import { getWordById } from "@/lib/words";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/mots/[id]">,
) {
  const { id } = await ctx.params;
  const entry = await getWordById(id);

  if (!entry) {
    return Response.json({ error: "Mot introuvable" }, { status: 404 });
  }

  return Response.json(entry);
}
