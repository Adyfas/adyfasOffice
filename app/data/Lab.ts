export type LabGradient = "aurora" | "sunset" | "mint" | "violet"; // kumpulan gradient
export type LabData = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  publishedAt?: string;
  author: string;
  category: string;
  gradient: LabGradient;
  content: string;
};

const markdownFiles = import.meta.glob<{ default: string }>("./lab/*.md", {
  eager: true,
  query: "?raw",
});

function isLabGradient(value: string): value is LabGradient {
  return ["aurora", "sunset", "mint", "violet"].includes(value);
}

function isSafeLabAsset(value: string): boolean {
  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return false;
  }
  if (
    !decoded.startsWith("/images/lab/") ||
    decoded.split("/").some((part) => part === "." || part === "..") ||
    !/^\/images\/lab\/[A-Za-z0-9._/ -]+$/.test(decoded)
  ) {
    return false;
  }
  return true;
}

function isSafeImage(value: string): boolean {
  return (
    isSafeLabAsset(value) &&
    /^\/images\/lab\/[A-Za-z0-9._/ -]+\.(png|jpe?g|webp|avif|gif)$/i.test(
      decodeURIComponent(value),
    )
  );
}

function isValidPublishedAt(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function parseFrontmatter(source: string, filePath: string): LabData {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`Missing frontmatter in Lab markdown: ${filePath}`);
  }

  const fields: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const field = line.match(/^([a-zA-Z]+):\s*(.*?)\s*$/);
    if (!field) {
      throw new Error(`Invalid frontmatter field in Lab markdown: ${filePath}`);
    }

    const [, key, rawValue] = field;
    if (key in fields) {
      throw new Error(`Duplicate frontmatter field in Lab markdown: ${filePath}`);
    }
    let value = rawValue;
    if (value.startsWith('"') && value.endsWith('"')) {
      try {
        value = JSON.parse(value) as string;
      } catch {
        throw new Error(`Invalid quoted frontmatter value in Lab markdown: ${filePath}`);
      }
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1).replace(/''/g, "'");
    }
    fields[key] = value;
  }

  const slug = filePath.split("/").pop()?.replace(/\.md$/, "") ?? "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid Lab markdown filename: ${filePath}`);
  }

  const {
    title,
    description,
    cover,
    publishedAt,
    author,
    category,
    gradient,
  } = fields;
  if (!title || !description || !cover || !author || !category || !gradient) {
    throw new Error(`Incomplete frontmatter in Lab markdown: ${filePath}`);
  }
  if (!isSafeImage(cover)) {
    throw new Error(`Lab cover must be an image inside /images/lab/: ${filePath}`);
  }
  if (publishedAt && !isValidPublishedAt(publishedAt)) {
    throw new Error(`Invalid Lab publication date in markdown: ${filePath}`);
  }
  if (!isLabGradient(gradient)) {
    throw new Error(`Invalid Lab gradient in markdown: ${filePath}`);
  }

  return {
    slug,
    title,
    description,
    cover,
    publishedAt,
    author,
    category,
    gradient,
    content: match[2].trim(),
  };
}

const labs = Object.entries(markdownFiles)
  .map(([filePath, module]) => parseFrontmatter(module.default, filePath))
  .sort(
    (a, b) =>
      (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") ||
      a.title.localeCompare(b.title),
  );

const slugs = new Set<string>();
for (const lab of labs) {
  if (slugs.has(lab.slug)) {
    throw new Error(`Duplicate Lab markdown slug: ${lab.slug}`);
  }
  slugs.add(lab.slug);
}

export function getLabBySlug(slug: string): LabData | undefined {
  return labs.find((lab) => lab.slug === slug);
}

export default labs;
