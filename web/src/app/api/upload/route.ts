// app/api/upload/route.ts
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  const form = await req.formData();
  const files = form.getAll("files");

  // ✅ сохраняем именно в ./public/uploads
  const dir = path.resolve("./public/uploads");
  await fs.mkdir(dir, { recursive: true });

  const urls: string[] = [];

  for (const f of files) {
    if (!(f instanceof File)) continue;

    // читаем содержимое файла
    const buf = Buffer.from(await f.arrayBuffer());

    // делаем безопасное имя
    const safe = Date.now() + "-" + f.name.replace(/[^a-zA-Z0-9_.-]/g, "_");

    // полный путь к файлу
    const fp = path.join(dir, safe);

    // пишем файл на диск
    await fs.writeFile(fp, buf);

    // URL для фронта (будет доступен по https://domain.com/uploads/filename)
    urls.push("/uploads/" + safe);
  }

  return Response.json({ urls });
}
