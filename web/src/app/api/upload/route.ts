import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Busboy from "busboy";
import { Readable } from "stream";
import { ReadableStream as NodeReadableStream } from "stream/web";

export const maxDuration = 600; // 10 минут
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  return new Promise((resolve, reject) => {
    const headers = Object.fromEntries(req.headers);
    const busboy = Busboy({ headers });

    const uploadDir = path.resolve("./public/uploads");
    fs.mkdirSync(uploadDir, { recursive: true });

    const urls: string[] = [];
    const filePromises: Promise<void>[] = []; // ✅ Добавляем массив промисов

    busboy.on("file", (_fieldname, file, info) => {
      const safe = Date.now() + "-" + info.filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const filepath = path.join(uploadDir, safe);
      const writeStream = fs.createWriteStream(filepath);

      // ✅ Создаём промис для каждого файла
      const filePromise = new Promise<void>((resolveFile, rejectFile) => {
        file.pipe(writeStream);

        writeStream.on("close", () => {
          urls.push("/uploads/" + safe);
          console.log(`✅ Uploaded: ${info.filename}`);
          resolveFile();
        });

        writeStream.on("error", (err) => {
          console.error("Ошибка записи файла:", err);
          rejectFile(err);
        });

        // ✅ Обработка ошибок чтения файла
        file.on("error", (err) => {
          console.error("Ошибка чтения файла:", err);
          rejectFile(err);
        });
      });

      filePromises.push(filePromise);
    });

    busboy.on("finish", async () => {
      try {
        // ✅ Ждём завершения записи ВСЕХ файлов
        await Promise.all(filePromises);
        resolve(NextResponse.json({ urls }));
      } catch (err) {
        console.error("Ошибка при завершении загрузки:", err);
        reject(
          NextResponse.json({ error: "Ошибка при записи файлов" }, { status: 500 })
        );
      }
    });

    busboy.on("error", (err) => {
      console.error("Ошибка загрузки:", err);
      reject(
        NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 })
      );
    });

    const webStream = req.body as unknown as NodeReadableStream | null;
    if (!webStream) {
      reject(NextResponse.json({ error: "Нет тела запроса" }, { status: 400 }));
      return;
    }

    const nodeStream = Readable.fromWeb(webStream);
    nodeStream.pipe(busboy);
  });
}