import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const enDir = path.join(root, "locales", "en");
const thDir = path.join(root, "locales", "th");

function emptyValues(value) {
  if (typeof value === "string") return "";
  if (Array.isArray(value)) return value.map(emptyValues);
  const result = {};
  for (const [key, nested] of Object.entries(value)) {
    result[key] = emptyValues(nested);
  }
  return result;
}

fs.mkdirSync(thDir, { recursive: true });

for (const file of fs.readdirSync(enDir).filter((name) => name.endsWith(".json"))) {
  const en = JSON.parse(fs.readFileSync(path.join(enDir, file), "utf8"));
  fs.writeFileSync(path.join(thDir, file), `${JSON.stringify(emptyValues(en), null, 2)}\n`);
}

console.log("Generated empty Thai locale files from English.");
