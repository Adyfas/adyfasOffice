import { marked, type Token, type Tokens } from "marked";
import type { ReactNode } from "react";
import {
  isChartFence,
  isFlowchartFence,
  LabChart,
  LabFlowchart,
} from "~/components/lab/LabCharts";

function safeLink(href: string): boolean {
  if (/[\\\u0000-\u001f]/.test(href)) return false;
  try {
    const url = new URL(href, "https://adyfas.com");
    if (url.protocol === "mailto:") return href.startsWith("mailto:");
    if (url.protocol === "http:" || url.protocol === "https:") {
      return !url.username && !url.password;
    }
    return (
      url.origin === "https://adyfas.com" &&
      (href.startsWith("/") || href.startsWith("#")) &&
      !href.startsWith("//")
    );
  } catch {
    return false;
  }
}

function safeImage(href: string): boolean {
  return (
    /^\/images\/lab\/[A-Za-z0-9._/-]+$/.test(href) &&
    !href.split("/").some((part) => part === "." || part === "..")
  );
}

function safeLabDownload(href: string): boolean {
  let decoded: string;
  try {
    decoded = decodeURIComponent(href);
  } catch {
    return false;
  }
  return (
    /^\/downloads\/lab\/[A-Za-z0-9._/-]+\.(pdf|zip|txt|md|csv|json|docx|xlsx|pptx|odt|ods)$/i.test(
      decoded,
    ) &&
    !decoded.split("/").some((part) => part === "." || part === "..")
  );
}

function safeVideo(href: string): boolean {
  let decoded: string;
  try {
    decoded = decodeURIComponent(href);
  } catch {
    return false;
  }
  return (
    /^\/images\/lab\/video\/[A-Za-z0-9._ -]+\.(mp4|webm|ogg)$/i.test(decoded) &&
    !decoded.split("/").some((part) => part === "." || part === "..")
  );
}

function isAutoModifier(token: Token | undefined): boolean {
  return token?.type === "text" && /^\s*\{auto\}\s*$/.test(token.text);
}

function inlineContent(
  tokens: Token[] | undefined,
  text: string,
  prefix: string,
): ReactNode[] {
  return inline(tokens ?? marked.Lexer.lexInline(text), prefix);
}

function inline(tokens: Token[], prefix: string): ReactNode[] {
  return tokens.map((token, index) => {
    const key = `${prefix}-${index}`;
    switch (token.type) {
      case "text":
      case "escape":
        if (
          token.type === "text" &&
          index > 0 &&
          tokens[index - 1].type === "image" &&
          safeVideo((tokens[index - 1] as Tokens.Image).href) &&
          isAutoModifier(token)
        ) {
          return null;
        }
        return token.text;
      case "strong":
        return (
          <strong key={key}>
            {inlineContent(token.tokens, token.text, key)}
          </strong>
        );
      case "em":
        return <em key={key}>{inlineContent(token.tokens, token.text, key)}</em>;
      case "del":
        return <del key={key}>{inlineContent(token.tokens, token.text, key)}</del>;
      case "codespan":
        return <code key={key}>{token.text}</code>;
      case "br":
        return <br key={key} />;
      case "link": {
        const children = inlineContent(token.tokens, token.text, key);
        if (!safeLink(token.href)) return <span key={key}>{children}</span>;
        const external = /^https?:\/\//i.test(token.href);
        const downloadable = safeLabDownload(token.href);
        return (
          <a
            key={key}
            href={token.href}
            download={downloadable ? token.href.split("/").pop() : undefined}
            title={token.title ?? undefined}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        );
      }
      case "image":
        if (safeVideo(token.href)) {
          const autoPlay = isAutoModifier(tokens[index + 1]);
          return (
            <span key={key} className="my-8 block overflow-hidden rounded-xl">
              <video
                controls
                playsInline
                autoPlay={autoPlay}
                loop={autoPlay}
                muted={autoPlay}
                preload={autoPlay ? "auto" : "metadata"}
                aria-label={token.text || "Video eksperimen Adyfas"}
                className="aspect-video w-full bg-black"
              >
                <source
                  src={token.href}
                  type={
                    token.href.toLowerCase().endsWith(".webm")
                      ? "video/webm"
                      : token.href.toLowerCase().endsWith(".ogg")
                        ? "video/ogg"
                        : "video/mp4"
                  }
                />
                Browser Anda tidak mendukung pemutaran video.
              </video>
              {token.text && (
                  <span className="mt-2 block text-sm text-gray-500 dark:text-slate-400">
                  {token.text}
                  </span>
              )}
            </span>
          );
        }
        return safeImage(token.href) ? (
          <img
            key={key}
            src={token.href}
            alt={token.text}
            title={token.title ?? undefined}
            loading="lazy"
          />
        ) : null;
      case "html":
        return null;
      default:
        return null;
    }
  });
}

function blocks(tokens: Token[], prefix: string): ReactNode[] {
  return tokens.map((token, index) => {
    const key = `${prefix}-${index}`;
    switch (token.type) {
      case "heading": {
        const heading = token as Tokens.Heading;
        const Heading = `h${Math.max(2, Math.min(heading.depth, 6))}` as
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6";
        return (
          <Heading key={key} className="font-semibold tracking-tight text-gray-900 dark:text-white">
            {inlineContent(heading.tokens, heading.text, key)}
          </Heading>
        );
      }
      case "paragraph":
        return (
          <p key={key} className="leading-8 text-gray-700 dark:text-slate-300">
            {inlineContent(token.tokens, token.text, key)}
          </p>
        );
      case "text": {
        const text = token as Tokens.Text;
        return (
          <span key={key}>
            {inlineContent(text.tokens, text.text, key)}
          </span>
        );
      }
      case "blockquote":
        {
          const quote = token as Tokens.Blockquote;
        return (
          <blockquote
            key={key}
            className="border-l-2 border-blue-500 pl-5 text-gray-600 dark:border-sky-400 dark:text-slate-300"
          >
            {blocks(quote.tokens, key)}
          </blockquote>
        );
        }
      case "list": {
        const list = token as Tokens.List;
        const List = list.ordered ? "ol" : "ul";
        return (
          <List
            key={key}
            className={
              list.ordered
                ? "list-decimal space-y-2 pl-6 text-gray-700 dark:text-slate-300"
                : "list-disc space-y-2 pl-6 text-gray-700 dark:text-slate-300"
            }
          >
            {list.items.map((item: Tokens.ListItem, itemIndex: number) => (
              <li key={`${key}-${itemIndex}`}>{blocks(item.tokens, `${key}-${itemIndex}`)}</li>
            ))}
          </List>
        );
      }
      case "code":
        if (isChartFence((token as Tokens.Code).lang)) {
          return <LabChart key={key} source={token.text} />;
        }
        if (isFlowchartFence((token as Tokens.Code).lang)) {
          return <LabFlowchart key={key} source={token.text} />;
        }
        return (
          <pre
            key={key}
            className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-white/10 dark:bg-white/5"
          >
            <code>{token.text}</code>
          </pre>
        );
      case "hr":
        return <hr key={key} className="border-gray-200 dark:border-white/10" />;
      case "table":
        {
          const table = token as Tokens.Table;
        return (
          <div key={key} className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr>
                  {table.header.map((cell: Tokens.TableCell, cellIndex: number) => (
                    <th
                      key={`${key}-head-${cellIndex}`}
                      className="border-b border-gray-200 px-3 py-2 font-semibold dark:border-white/10"
                    >
                      {inline(cell.tokens, `${key}-head-${cellIndex}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row: Tokens.TableCell[], rowIndex: number) => (
                  <tr key={`${key}-row-${rowIndex}`}>
                    {row.map((cell: Tokens.TableCell, cellIndex: number) => (
                      <td
                        key={`${key}-row-${rowIndex}-${cellIndex}`}
                        className="border-b border-gray-200 px-3 py-2 dark:border-white/10"
                      >
                        {inline(cell.tokens, `${key}-row-${rowIndex}-${cellIndex}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        }
      case "html":
      case "space":
      case "def":
        return null;
      default:
        return null;
    }
  });
}

export default function LabMarkdown({ source }: { source: string }) {
  return (
    <div className="space-y-6 [&_a]:font-medium [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-4 dark:[&_a]:text-sky-300 [&_blockquote_p]:my-0 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em] dark:[&_code]:bg-white/10 [&_h2]:mt-10 [&_h2]:text-2xl [&_h3]:mt-8 [&_h3]:text-xl [&_img]:my-8 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-xl [&_li_p]:my-1 [&_pre_code]:bg-transparent [&_pre_code]:p-0">
      {blocks(marked.lexer(source), "lab-content")}
    </div>
  );
}

