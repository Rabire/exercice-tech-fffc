interface CliArgs {
  data?: string;
  metadata?: string;
  output?: string;
  help?: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];

    switch (a) {
      case "--data":
        args.data = argv[++i];
        break;

      case "--metadata":
        args.metadata = argv[++i];
        break;

      case "--output":
        args.output = argv[++i];
        break;

      case "--help":
      case "-h":
        args.help = true;
        break;

      default:
        if (!a?.startsWith("--")) {
          // ignore positional for now
        }
        break;
    }
  }

  return args;
}
