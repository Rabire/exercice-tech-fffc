import { convertFixedWidthStreamToCsv } from "../core/converter.ts";
import { parseMetadataFromBlob } from "../core/metadata.ts";
import { asyncGeneratorToReadableStream } from "../adapters/generator-to-stream.ts";

// Simple router using Bun.serve
export function startServer(port = Number(Bun.env.PORT ?? 3001)) {
  const server = Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url);
      if (req.method === "GET" && url.pathname === "/health") {
        return new Response(JSON.stringify({ ok: true }), {
          headers: { "content-type": "application/json" },
        });
      }

      if (req.method === "POST" && url.pathname === "/convert") {
        const contentType = req.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
          return new Response("Expected multipart/form-data", { status: 400 });
        }

        const form = await req.formData();
        const dataFile = form.get("data");
        const metadataFile = form.get("metadata");

        if (!(dataFile instanceof File) || !(metadataFile instanceof File)) {
          return new Response(
            "Fields 'data' and 'metadata' files are required",
            { status: 400 }
          );
        }

        try {
          // Parsing files

          const metadata = await parseMetadataFromBlob(metadataFile);

          const gen = convertFixedWidthStreamToCsv(
            dataFile.stream(),
            metadata,
            { lineBreak: "\r\n" }
          );

          const stream = asyncGeneratorToReadableStream(gen);
          return new Response(stream, {
            headers: {
              "content-type": "text/csv; charset=utf-8",
              "content-disposition": `attachment; filename="output.csv"`,
              "x-powered-by": "bun",
            },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return new Response(message, { status: 400 });
        }
      }

      return new Response("Not found", { status: 404 });
    },
  });

  // eslint-disable-next-line no-console
  console.log(`HTTP server listening on http://localhost:${server.port}`);
  return server;
}
