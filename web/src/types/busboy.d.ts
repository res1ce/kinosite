declare module "busboy" {
  import { Readable, Writable } from "stream";

  interface FileInfo {
    filename: string;
    encoding: string;
    mimeType: string;
  }

  interface BusboyConfig {
    headers: Record<string, string>;
    limits?: {
      fieldNameSize?: number;
      fieldSize?: number;
      fields?: number;
      fileSize?: number;
      files?: number;
      parts?: number;
      headerPairs?: number;
    };
  }

  interface BusboyInstance extends Writable {
    on(event: "file", listener: (fieldname: string, file: Readable, info: FileInfo) => void): this;
    on(event: "field", listener: (fieldname: string, value: string, fieldnameTruncated: boolean, valueTruncated: boolean, encoding: string, mimeType: string) => void): this;
    on(event: "finish", listener: () => void): this;
    on(event: "error", listener: (err: unknown) => void): this;
  }

  function Busboy(config: BusboyConfig): BusboyInstance;

  export = Busboy;
}
