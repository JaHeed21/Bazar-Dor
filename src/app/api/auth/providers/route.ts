import { connection } from "next/server";

export async function GET() {
  await connection();

  return Response.json(
    {
      google: Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
      ),
      github: Boolean(
        process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
      ),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
