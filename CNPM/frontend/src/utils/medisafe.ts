export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null) {
    const maybeError = error as { message?: string; detail?: string };
    return maybeError.message || maybeError.detail || fallback;
  }

  return fallback;
}

export function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number | null | undefined>>) {
  const escapeValue = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return '';
    const text = String(value).replace(/"/g, '""');
    return `"${text}"`;
  };

  const csv = [headers.map(escapeValue).join(','), ...rows.map((row) => row.map(escapeValue).join(','))].join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}