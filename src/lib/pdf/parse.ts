export async function extractPdfText(buffer: Buffer) {
  const module = (await import("pdf-parse")) as unknown as {
    default?: (input: Buffer) => Promise<{ text?: string }>;
  };
  const pdfParse = module.default ?? (module as any);
  const data = await pdfParse(buffer);
  return data.text ?? "";
}
