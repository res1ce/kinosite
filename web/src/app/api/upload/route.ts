import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  const form = await req.formData();
  const files = form.getAll("files");
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const urls: string[] = [];
  for (const f of files) {
    if (!(f instanceof File)) continue;
    const buf = Buffer.from(await f.arrayBuffer());
    const safe = Date.now() + "-" + f.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const fp = path.join(dir, safe);
    await fs.writeFile(fp, buf);
    urls.push("/uploads/" + safe);
  }
  return Response.json({ urls });
}


