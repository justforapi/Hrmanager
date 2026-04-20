import { PDFDocument, StandardFonts } from "pdf-lib";

function wrapLines(text: string, maxLength: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxLength) {
      lines.push(current.trim());
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  if (current.trim()) {
    lines.push(current.trim());
  }
  return lines;
}

export async function generateCvPdf(content: string) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([612, 792]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const margin = 50;
  const maxWidth = 80;

  let y = 740;
  const lines = content.split("\n").flatMap((line) => wrapLines(line, maxWidth));

  for (const line of lines) {
    page.drawText(line, { x: margin, y, size: fontSize, font });
    y -= 18;
    if (y < 60) {
      y = 740;
      page = pdfDoc.addPage([612, 792]);
    }
  }

  return Buffer.from(await pdfDoc.save());
}
