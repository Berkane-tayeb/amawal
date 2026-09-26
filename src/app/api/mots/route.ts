import { searchWords } from "@/lib/words";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entries = await searchWords({
    q: searchParams.get("q") ?? undefined,
    letter: searchParams.get("letter") ?? undefined,
  });

  return Response.json({ count: entries.length, words: entries });
}
