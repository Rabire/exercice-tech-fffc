#!/usr/bin/env bun

import { convertFixedWidthStreamToCsv } from "../core/converter.ts";
import { parseMetadataFromBlob } from "../core/metadata";
import { parseArgs } from "./parse-args.ts";

/**
 * Main CLI entry point for fixed-width to CSV conversion
 * Handles argument parsing, file validation, and streaming conversion
 */
async function main() {
  // Parse command line arguments, skipping the first two (node/bun executable and script path)
  const args = parseArgs(Bun.argv.slice(2));

  // Early exit for help request - no need to validate other args
  if (args.help) {
    printHelp();
    return;
  }

  // Validate required arguments before proceeding with expensive file operations
  if (!args.data || !args.metadata) {
    console.error("--data and --metadata are required");
    process.exit(1);
  }

  // Create file handles - Bun.file() is lazy, doesn't read until accessed
  const dataFile = Bun.file(args.data);
  const metaFile = Bun.file(args.metadata);

  // Validate file existence before attempting to process
  // Using Promise.all would be more efficient but less clear error messaging
  if (!(await dataFile.exists()) || !(await metaFile.exists())) {
    console.error("Input files not found");
    process.exit(1);
  }

  try {
    // Parse metadata first - fail fast if metadata is invalid
    const metadata = await parseMetadataFromBlob(metaFile);

    // Create the conversion generator - this is lazy and won't start processing until consumed
    const gen = convertFixedWidthStreamToCsv(dataFile.stream(), metadata);

    // Wrap the async generator in a ReadableStream for easier consumption
    // This pattern allows for backpressure handling and proper resource cleanup
    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        const { done, value } = await gen.next();
        if (done) controller.close();
        else controller.enqueue(value);
      },
    });

    // Determine output destination - file writer or stdout
    // Using optional chaining and nullish coalescing for clean fallback logic
    const out = args.output ? Bun.file(args.output) : undefined;
    const writable = out ? out.writer() : Bun.stdout.writer();

    // Stream processing loop - processes chunks as they become available
    // This approach maintains constant memory usage regardless of input file size
    for await (const chunk of stream) {
      await writable.write(chunk);
    }

    // Ensure all data is flushed to the output destination
    await writable.end();
  } catch (err) {
    // Provide user-friendly error messages while preserving error details
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

/**
 * Display usage information and available options
 * Formatted for readability in terminal output
 */
function printHelp() {
  console.log(
    `Fixed-width to CSV Converter

Usage:
  bun run cli --data <datafile> --metadata <metafile> [--output out.csv]

Options:
  --data <path>       Path to fixed-width data file
  --metadata <path>   Path to CSV metadata file describing column layout
  --output <path>     Output CSV file path (writes to stdout if omitted)
  --help, -h          Show this help message

Examples:
  bun run cli --data input.txt --metadata layout.csv
  bun run cli --data input.txt --metadata layout.csv --output result.csv

Note: Use 'bun run cli' instead of the full path for better DX`
  );
}

// Execute main function - using top-level await equivalent
main();

// TODO: Feedback utilisateur pour les gros fichiers qui prennent du temps (progress bar par exemple). Évite l'impression que le programme est planté.
// TODO: Vérifier que le répertoire de sortie existe et est writable avant de commencer le traitement. Évite d'échouer après avoir traité tout le fichier.
