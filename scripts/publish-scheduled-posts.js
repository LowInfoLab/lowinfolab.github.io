import fs from "fs";
import path from "path";
import { DateTime } from "luxon";

const CONTENT_DIR = path.join("src", "data", "blog");
const TIMEZONE = "America/Toronto";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");

// ANSI color codes
const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
};

function getMarkdownFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(dir, file));
}

function readFrontMatter(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/---\s*([\s\S]*?)\s*---/);
  if (!match) return {};

  const fmLines = match[1].split("\n");
  const fm = {};
  fmLines.forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes
    value = value.replace(/^"|"$/g, "").replace(/^'|'$/g, "");

    // Convert booleans
    if (value === "true") value = true;
    else if (value === "false") value = false;

    fm[key] = value;
  });

  return fm;
}

function updateDraft(filePath) {
  if (DRY_RUN) return;
  const content = fs.readFileSync(filePath, "utf8");
  const updated = content.replace(/draft:\s*true/, "draft: false");
  fs.writeFileSync(filePath, updated, "utf8");
}

function formatDate(pubDatetime) {
  const dt = DateTime.fromISO(pubDatetime, { zone: "utc" });
  if (!dt.isValid) return { date: "Invalid DateTime", time: "--:--" };
  const zoned = dt.setZone(TIMEZONE);
  return {
    date: zoned.toFormat("LLLL dd yyyy"), // Month Day Year
    time: zoned.toFormat("HH:mm"),        // 24-hour time
  };
}

// Helper for padding columns
function pad(str, length) {
  return (str + " ".repeat(length)).slice(0, length);
}

function publishScheduledPosts() {
  const files = getMarkdownFiles(CONTENT_DIR);
  const now = DateTime.now().setZone(TIMEZONE);

  const published = [];
  const future = [];

  files.forEach((file) => {
    const fm = readFrontMatter(file);
    const pubDt = fm.pubDatetime;
    const draft = fm.draft === true;

    if (!pubDt) {
      future.push({ file, date: "Invalid DateTime", time: "--:--" });
      return;
    }

    const { date, time } = formatDate(pubDt);
    const pubDate = DateTime.fromISO(pubDt, { zone: "utc" }).setZone(TIMEZONE);

    if (draft && pubDate <= now) {
      published.push({ file, date, time });
      updateDraft(file);
    } else {
      future.push({ file, date, time });
    }
  });

  // Sort chronologically
  published.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  future.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  console.log(`Publishing scheduled posts${DRY_RUN ? " (dry run)" : ""}...\n`);

  const colWidths = {
    file: 50,
    date: 20,
    time: 10,
    timezone: 20,
  };

  console.log(`${COLORS.green}PUBLISHED:${COLORS.reset}`);
  if (published.length === 0) console.log("  (none)");
  published.forEach((p) =>
    console.log(
      `  ${pad(path.basename(p.file), colWidths.file)} ${pad(p.date, colWidths.date)} ${pad(p.time, colWidths.time)} ${pad(TIMEZONE, colWidths.timezone)}`
    )
  );

  console.log(`\n${COLORS.yellow}FUTURE:${COLORS.reset}`);
  if (future.length === 0) console.log("  (none)");
  future.forEach((f) =>
    console.log(
      `  ${pad(path.basename(f.file), colWidths.file)} ${pad(f.date, colWidths.date)} ${pad(f.time, colWidths.time)} ${pad(TIMEZONE, colWidths.timezone)}`
    )
  );

  console.log("\nSummary:");
  console.log(`  Published: ${published.length}`);
  console.log(`  Skipped: 0`);
  console.log(`  Future posts: ${future.length}`);
}

publishScheduledPosts();