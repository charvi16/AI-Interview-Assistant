import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\d{10}/i;

export async function parseResume(file) {
  function extractName(text) {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    for (let line of lines) {
      const words = line.split(" ");
      if (words.length >= 2 && words.length <= 3) {
        const isCapitalized = words.every(
          (w) => w[0] && w[0] === w[0].toUpperCase()
        );
        if (isCapitalized) return line;
      }
    }
    return "";
  }

  let text = "";
  if (file.type === "application/pdf") {
    text = await extractFromPDF(file);
  } else if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    text = await extractFromDOCX(file);
  } else {
    throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
  }

  text = text.replace(/\s+/g, " ").trim();

  const name = extractName(text);
  const email = text.match(emailRegex)?.[0] || "";
  const phone = text.match(phoneRegex)?.[0] || "";

  const skills = extractSkillsDynamic(text);

  let finalName = name;
  let finalEmail = email;
  let finalPhone = phone;

  if (!finalName)
    finalName = window.prompt("Couldn't detect your name. Please enter your full name:");
  if (!finalEmail)
    finalEmail = window.prompt("Couldn't detect your email. Please enter your email address:");
  if (!finalPhone)
    finalPhone = window.prompt("Couldn't detect your phone number. Please enter your 10-digit phone number:");

  return {
    name: finalName?.trim() || "",
    email: finalEmail?.trim() || "",
    phone: finalPhone?.trim() || "",
    skills,
  };
}

async function extractFromPDF(file) {
  const pdfData = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    text += strings.join(" ") + "\n";
  }
  return text;
}

async function extractFromDOCX(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
function extractSkillsDynamic(text) {
  const lines = text.split(/\n|•|,/).map((l) => l.trim());
  const skillLines = [];
  for (const line of lines) {
    if (
      /skills?/i.test(line) ||              
      /(technologies|tools|frameworks)/i.test(line)
    ) {
      skillLines.push(line);
    }
  }

  const allText = text.toLowerCase();
  const skillSectionMatch = allText.match(
    /(skills|technical skills|technologies|tools)[:\-]([\s\S]{0,300})/
  );

  let extracted = [];
  if (skillSectionMatch) {
    extracted = skillSectionMatch[2]
      .split(/,|\/|•|\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 40);
  } else {
    const potential = text.match(/\b([A-Z][a-zA-Z0-9\+\#\.\-]{1,20})\b/g) || [];
    extracted = potential.filter((w) =>
      /[A-Z]/.test(w) && !/Name|Email|Phone|Address/i.test(w)
    );
  }

  const cleaned = extracted.map((s) =>
    s.replace(/[^a-zA-Z0-9\+\#\.\-]/g, "").trim()
  );
  const unique = [...new Set(cleaned)].filter(Boolean);

  const blacklist = ["Skills", "Name", "Email", "Phone", "Address", "Experience"];
  return unique.filter((s) => !blacklist.includes(s));
}
