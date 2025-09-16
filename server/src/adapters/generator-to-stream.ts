/**
 * Adapter: wraps an AsyncGenerator<Uint8Array> (produced by core conversion)
 * into a Web ReadableStream so Bun's Response can stream it over HTTP.
 *
 * Context of use (server/src/api/server.ts):
 *   const gen = convertFixedWidthStreamToCsv(dataFile.stream(), metadata);
 *   const stream = asyncGeneratorToReadableStream(gen);
 *   return new Response(stream, { headers: { "content-type": "text/csv; charset=utf-8" } });
 *
 * Benefits:
 * - Streams CSV progressively to the client (no full buffering in memory).
 * - Surfaces backpressure via ReadableStream's pull().
 * - Propagates cancellation (client disconnect) to the upstream generator.
 */

/**
 * Converts an AsyncGenerator<Uint8Array> to a ReadableStream<Uint8Array>.
 *
 * Behavior:
 * - On pull(): advance the generator one step and enqueue the chunk.
 * - On completion: close the stream controller.
 * - On error: error the controller so the HTTP response fails appropriately.
 * - On cancel(): try to signal the generator (.throw or .return) for cleanup.
 */
export function asyncGeneratorToReadableStream(
  generator: AsyncGenerator<Uint8Array>
): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        // Drive the generator one step when the consumer requests more data.
        const { value, done } = await generator.next();
        if (done) {
          // No more chunks -> close the stream (signals end of HTTP body).
          controller.close();
          return;
        }
        // Send the produced chunk downstream (to the HTTP client).
        controller.enqueue(value);
      } catch (err) {
        // Surface upstream errors to the stream consumer (HTTP client/middleware).
        controller.error(err);
      }
    },

    async cancel(reason) {
      // If the consumer cancels (e.g., client disconnects), attempt to notify
      // the generator so it can free resources (file handles, buffers, etc.).
      try {
        if (typeof (generator as any).throw === "function") {
          await (generator as any).throw(reason);
        } else if (typeof (generator as any).return === "function") {
          await (generator as any).return(undefined);
        }
      } catch {
        // Swallow any cleanup errors; cancellation is already in progress.
      }
    },
  });
}
