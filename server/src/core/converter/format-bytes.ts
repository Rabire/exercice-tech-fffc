export function formatBytes(bytes: number): string {
  const GB = 1024 ** 3;
  const MB = 1024 ** 2;
  const KB = 1024;
  if (Number.isNaN(bytes) || bytes < 0) return "0 B";
  if (bytes >= GB) return `${(bytes / GB).toFixed(2)} GB`;
  if (bytes >= MB) return `${(bytes / MB).toFixed(2)} MB`;
  if (bytes >= KB) return `${(bytes / KB).toFixed(2)} KB`;
  return `${bytes} B`;
}
