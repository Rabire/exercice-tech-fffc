import { asyncGeneratorToReadableStream } from "../adapters/generator-to-stream.ts";
import { convertFixedWidthStreamToCsv } from "../core/converter";
import { parseMetadataFromBlob } from "../core/metadata";

const port = Number(Bun.env.PORT ?? 3001);

const corsHeaders = {
  "access-control-allow-origin": "https://ikki.rabire.com",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type,accept",
  "access-control-expose-headers": "content-disposition",
} as const;

function json(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    ...init,
  });
}

function applyCors(res: Response): Response {
  const headers = new Headers(res.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    if (!headers.has(key)) headers.set(key, value);
  }
  return new Response(res.body, { status: res.status, headers });
}

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (req.method === "OPTIONS") return new Response(null, { status: 204 });

  if (req.method === "GET" && url.pathname === "/health") {
    return json({ ok: true });
  }

  if (req.method === "POST" && url.pathname === "/convert") {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return json(
        { error: "invalid_request", message: "Expected multipart/form-data" },
        { status: 400 }
      );
    }

    // Note: req.formData() yields File parts backed by temporary files/streams in Bun,
    // so large uploads do not need to be fully buffered in memory here.
    const form = await req.formData();
    const dataFile = form.get("data");
    const metadataFile = form.get("metadata");

    if (!(dataFile instanceof File) || !(metadataFile instanceof File)) {
      return json(
        {
          error: "invalid_request",
          message: "Fields 'data' and 'metadata' files are required",
        },
        { status: 400 }
      );
    }

    try {
      const metadata = await parseMetadataFromBlob(metadataFile);
      const gen = convertFixedWidthStreamToCsv(dataFile.stream(), metadata);
      const stream = asyncGeneratorToReadableStream(gen);

      return new Response(stream, {
        headers: {
          "content-type": "text/csv; charset=utf-8",
          "content-disposition": `attachment; filename="output.csv"`,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return json({ error: "conversion_error", message }, { status: 400 });
    }
  }

  return json({ error: "not_found", message: "Not found" }, { status: 404 });
}

// Start HTTP server with explicit body size & timeout to support large uploads
const server = Bun.serve({
  port,
  maxRequestBodySize: 2048 * 1024 * 1024, // 2 GiB,
  async fetch(req) {
    const res = await handleRequest(req);
    return applyCors(res);
  },
});

console.info(`HTTP server listening on http://localhost:${server.port}`);
