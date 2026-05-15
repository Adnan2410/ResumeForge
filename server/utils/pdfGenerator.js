import { PassThrough } from "stream";
import PDFDocument from "pdfkit";

export const generatePDFBuffer = async (textContent) => {
  const doc = new PDFDocument();
  const stream = doc.pipe(new PassThrough());

  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (err) => reject(err));

    doc.text(textContent);
    doc.end();
  });
};
