import { marked } from "marked";
import { useId } from "react";

type ChartKind = "bar" | "line";

type ChartData = {
  type: ChartKind;
  title: string;
  labels: string[];
  values: number[];
};

function parseChart(source: string): ChartData {
  const fields: Record<string, string> = {};
  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf(":");
    if (separator < 1) throw new Error("Use `key: value` for each chart line.");
    const key = trimmed.slice(0, separator).trim().toLowerCase();
    if (key in fields) throw new Error(`Duplicate chart field: ${key}`);
    fields[key] = trimmed.slice(separator + 1).trim();
  }

  if (fields.type !== "bar" && fields.type !== "line") {
    throw new Error("Chart type must be `bar` or `line`.");
  }
  if (!fields.title || !fields.labels || !fields.values) {
    throw new Error("Chart needs `title`, `labels`, and `values`.");
  }

  const labels = fields.labels.split("|").map((label) => label.trim());
  const values = fields.values.split(",").map((value) => Number(value.trim()));
  if (
    labels.length < 2 ||
    labels.length > 12 ||
    labels.some((label) => !label || label.length > 24)
  ) {
    throw new Error("Add 2–12 labels, separated with `|` (maximum 24 characters each).");
  }
  if (
    values.length !== labels.length ||
    values.some((value) => !Number.isFinite(value) || value < 0) ||
    Math.max(...values) === 0
  ) {
    throw new Error("Add one positive, non-negative number per label.");
  }

  return { type: fields.type, title: fields.title, labels, values };
}

function ChartError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200"
    >
      Chart Markdown error: {message}
    </p>
  );
}

export function LabChart({ source }: { source: string }) {
  const chartId = `lab-chart-${useId().replace(/:/g, "")}`;
  try {
    const { type, title, labels, values } = parseChart(source);
    const width = 720;
    const height = 340;
    const left = 54;
    const right = 20;
    const top = 28;
    const bottom = 54;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const maximum = Math.max(...values);
    const step = plotWidth / labels.length;
    const points = values.map((value, index) => ({
      x: left + step * (index + 0.5),
      y: top + plotHeight - (value / maximum) * plotHeight,
    }));

    return (
      <figure className="overflow-hidden rounded-2xl border border-gray-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
        <figcaption className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
          {title}
        </figcaption>
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-labelledby={`${chartId}-title ${chartId}-description`}
            className="min-w-[520px] w-full overflow-visible"
          >
            <title id={`${chartId}-title`}>{title}</title>
            <desc id={`${chartId}-description`}>
              {type === "bar" ? "Bar" : "Line"} chart.{" "}
              {labels.map((label, index) => `${label}: ${values[index]}`).join("; ")}.
            </desc>
            {[0, 1, 2, 3].map((line) => {
              const y = top + (plotHeight / 3) * line;
              return (
                <g key={line}>
                  <line
                    x1={left}
                    y1={y}
                    x2={width - right}
                    y2={y}
                    className="stroke-gray-200 dark:stroke-white/10"
                  />
                  <text
                    x={left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-gray-500 text-[11px] dark:fill-slate-400"
                  >
                    {Math.round(maximum * (1 - line / 3))}
                  </text>
                </g>
              );
            })}
            {type === "bar" ? (
              points.map((point, index) => {
                const barWidth = Math.min(42, step * 0.58);
                const barHeight = top + plotHeight - point.y;
                return (
                  <g key={labels[index]}>
                    <rect
                      x={point.x - barWidth / 2}
                      y={point.y}
                      width={barWidth}
                      height={barHeight}
                      rx={7}
                      fill={`url(#${chartId}-bar-gradient)`}
                    />
                    <text
                      x={point.x}
                      y={point.y - 8}
                      textAnchor="middle"
                      className="fill-gray-700 text-[11px] font-medium dark:fill-slate-200"
                    >
                      {values[index]}
                    </text>
                  </g>
                );
              })
            ) : (
              <>
                <polyline
                  points={points.map(({ x, y }) => `${x},${y}`).join(" ")}
                  fill="none"
                  stroke={`url(#${chartId}-line-gradient)`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {points.map((point, index) => (
                  <g key={labels[index]}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={5}
                      className="fill-white stroke-blue-600 dark:fill-[#151515] dark:stroke-sky-300"
                      strokeWidth="3"
                    />
                    <text
                      x={point.x}
                      y={point.y - 11}
                      textAnchor="middle"
                      className="fill-gray-700 text-[11px] font-medium dark:fill-slate-200"
                    >
                      {values[index]}
                    </text>
                  </g>
                ))}
              </>
            )}
            <defs>
              <linearGradient id={`${chartId}-bar-gradient`} x1="0" x2="1" y1="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <linearGradient id={`${chartId}-line-gradient`} x1="0" x2="1" y1="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            {labels.map((label, index) => (
              <text
                key={label}
                x={points[index].x}
                y={top + plotHeight + 28}
                textAnchor="middle"
                className="fill-gray-500 text-[11px] dark:fill-slate-400"
              >
                {label}
              </text>
            ))}
          </svg>
        </div>
        <table className="sr-only">
          <caption>{title} data</caption>
          <thead>
            <tr>
              <th scope="col">Label</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((label, index) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{values[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    );
  } catch (error) {
    return (
      <ChartError
        message={error instanceof Error ? error.message : "Unable to parse chart."}
      />
    );
  }
}

type FlowNode = {
  type: "start" | "process" | "decision" | "end";
  id: string;
  label: string;
};

type FlowEdge = {
  from: string;
  to: string;
  label?: string;
};

type PositionedNode = FlowNode & {
  x: number;
  y: number;
  width: number;
  height: number;
};

function parseFlowchart(source: string): {
  nodes: PositionedNode[];
  edges: FlowEdge[];
  width: number;
  height: number;
} {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  const identifiers = new Set<string>();

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const nodeMatch = trimmed.match(/^(start|process|decision|end):\s*([a-z0-9_-]+)\s*\|\s*(.{1,100})$/i);
    if (nodeMatch) {
      const [, type, id, label] = nodeMatch;
      if (identifiers.has(id)) throw new Error(`Duplicate node id: ${id}`);
      if (nodes.length >= 30) throw new Error("A flowchart can have at most 30 nodes.");
      identifiers.add(id);
      nodes.push({
        type: type.toLowerCase() as FlowNode["type"],
        id,
        label: label.trim(),
      });
      continue;
    }

    const labeledEdge = trimmed.match(/^([a-z0-9_-]+)\s+--\s*(.{1,30}?)\s*-->\s*([a-z0-9_-]+)$/i);
    const edge = labeledEdge ?? trimmed.match(/^([a-z0-9_-]+)\s*->\s*([a-z0-9_-]+)$/i);
    if (!edge) throw new Error(`Cannot read line: ${trimmed}`);
    if (edges.length >= 60) throw new Error("A flowchart can have at most 60 arrows.");
    edges.push(
      labeledEdge
        ? { from: edge[1], to: edge[3], label: edge[2].trim() }
        : { from: edge[1], to: edge[2] },
    );
  }

  if (nodes.length < 2) throw new Error("Add at least two flowchart nodes.");
  const starts = nodes.filter((node) => node.type === "start");
  if (starts.length !== 1) throw new Error("Add exactly one `start` node.");
  if (!nodes.some((node) => node.type === "end")) {
    throw new Error("Add at least one `end` node.");
  }

  const incoming = new Map(nodes.map((node) => [node.id, 0]));
  const outgoing = new Map(nodes.map((node) => [node.id, 0]));
  const adjacency = new Map(nodes.map((node) => [node.id, [] as string[]]));
  for (const edge of edges) {
    if (!identifiers.has(edge.from) || !identifiers.has(edge.to)) {
      throw new Error(`Arrow references an unknown node: ${edge.from} -> ${edge.to}`);
    }
    if (edge.from === edge.to) throw new Error("An arrow cannot point to its own node.");
    incoming.set(edge.to, incoming.get(edge.to)! + 1);
    outgoing.set(edge.from, outgoing.get(edge.from)! + 1);
    adjacency.get(edge.from)!.push(edge.to);
  }
  if (incoming.get(starts[0].id) !== 0) throw new Error("The start node cannot have incoming arrows.");
  if (nodes.some((node) => node.type === "end" && outgoing.get(node.id) !== 0)) {
    throw new Error("End nodes cannot have outgoing arrows.");
  }
  if (nodes.some((node) => node.type !== "end" && outgoing.get(node.id) === 0)) {
    throw new Error("Every non-end node needs at least one outgoing arrow.");
  }

  const indegree = new Map(incoming);
  const queue = nodes.filter((node) => indegree.get(node.id) === 0).map((node) => node.id);
  const ranks = new Map(nodes.map((node) => [node.id, 0]));
  const visited: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    visited.push(id);
    for (const next of adjacency.get(id)!) {
      ranks.set(next, Math.max(ranks.get(next)!, ranks.get(id)! + 1));
      indegree.set(next, indegree.get(next)! - 1);
      if (indegree.get(next) === 0) queue.push(next);
    }
  }
  if (visited.length !== nodes.length) {
    throw new Error("Flowcharts must not contain loops; draw a new step instead.");
  }
  const reachable = new Set<string>();
  const pending = [starts[0].id];
  while (pending.length) {
    const id = pending.pop()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    pending.push(...adjacency.get(id)!);
  }
  if (reachable.size !== nodes.length) throw new Error("Every node must connect to the start node.");

  const layers = new Map<number, FlowNode[]>();
  for (const node of nodes) {
    const rank = ranks.get(node.id)!;
    layers.set(rank, [...(layers.get(rank) ?? []), node]);
  }

  const width = Math.max(560, ...[...layers.values()].map((layer) => layer.length * 260 + 40));
  const layerGap = 150;
  const top = 64;
  const positioned: PositionedNode[] = [];
  for (const [rank, layer] of layers) {
    const layerWidth = layer.length * 260;
    layer.forEach((node, index) => {
      const isDecision = node.type === "decision";
      const nodeWidth = isDecision ? 164 : 216;
      const nodeHeight = isDecision ? 104 : 60;
      positioned.push({
        ...node,
        x: (width - layerWidth) / 2 + index * 260 + (260 - nodeWidth) / 2,
        y: top + rank * layerGap,
        width: nodeWidth,
        height: nodeHeight,
      });
    });
  }

  const height = Math.max(...positioned.map((node) => node.y + node.height)) + top;
  return { nodes: positioned, edges, width, height };
}

function FlowchartError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200"
    >
      Flowchart Markdown error: {message}
    </p>
  );
}

export function LabFlowchart({ source }: { source: string }) {
  const chartId = `lab-flowchart-${useId().replace(/:/g, "")}`;
  try {
    const { nodes, edges, width, height } = parseFlowchart(source);
    const byId = new Map(nodes.map((node) => [node.id, node]));

    return (
      <figure className="overflow-hidden rounded-2xl border border-gray-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
        <figcaption className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
          Flowchart
        </figcaption>
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-labelledby={`${chartId}-title`}
            className="mx-auto block h-auto"
            style={{ width: `${width}px` }}
          >
            <title id={`${chartId}-title`}>
              Flowchart: {nodes.map((node) => node.label).join(" to ")}
            </title>
            <defs>
              <marker
                id={`${chartId}-arrow`}
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
              >
                <path d="M0 0L10 5L0 10z" className="fill-blue-600 dark:fill-sky-300" />
              </marker>
            </defs>
            {edges.map((edge, index) => {
              const from = byId.get(edge.from)!;
              const to = byId.get(edge.to)!;
              const startX = from.x + from.width / 2;
              const startY = from.y + from.height;
              const endX = to.x + to.width / 2;
              const endY = to.y;
              const middleY = startY + (endY - startY) / 2;
              const path = `M ${startX} ${startY} V ${middleY} H ${endX} V ${endY - 5}`;
              return (
                <g key={`${edge.from}-${edge.to}-${index}`}>
                  <path
                    d={path}
                    fill="none"
                    className="stroke-blue-600 dark:stroke-sky-300"
                    strokeWidth="2"
                    markerEnd={`url(#${chartId}-arrow)`}
                  />
                  {edge.label && (
                    <text
                      x={(startX + endX) / 2 + 8}
                      y={middleY - 6}
                      className="fill-gray-600 text-[13px] font-medium dark:fill-slate-300"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
            {nodes.map((node) => (
              <g key={node.id}>
                {node.type === "decision" ? (
                  <polygon
                    points={`${node.x + node.width / 2},${node.y} ${node.x + node.width},${node.y + node.height / 2} ${node.x + node.width / 2},${node.y + node.height} ${node.x},${node.y + node.height / 2}`}
                    className="fill-amber-50 stroke-amber-500 dark:fill-amber-300/10 dark:stroke-amber-300"
                    strokeWidth="2"
                  />
                ) : (
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    rx={node.type === "start" || node.type === "end" ? 30 : 14}
                    className={
                      node.type === "start"
                        ? "fill-blue-50 stroke-blue-600 dark:fill-blue-300/10 dark:stroke-sky-300"
                        : node.type === "end"
                          ? "fill-emerald-50 stroke-emerald-600 dark:fill-emerald-300/10 dark:stroke-emerald-300"
                          : "fill-white stroke-gray-300 dark:fill-white/5 dark:stroke-white/25"
                    }
                    strokeWidth="2"
                  />
                )}
                <text
                  x={node.x + node.width / 2}
                  y={node.y + node.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gray-800 text-[14px] font-medium dark:fill-slate-100"
                >
                  {node.label.length > 28
                    ? `${node.label.slice(0, 27)}…`
                    : node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <ol className="sr-only">
          {nodes.map((node) => (
            <li key={node.id}>
              {node.type}: {node.label}
            </li>
          ))}
        </ol>
      </figure>
    );
  } catch (error) {
    return (
      <FlowchartError
        message={error instanceof Error ? error.message : "Unable to parse flowchart."}
      />
    );
  }
}

export function isChartFence(language: string | undefined): boolean {
  return language?.toLowerCase() === "chart";
}

export function isFlowchartFence(language: string | undefined): boolean {
  return language?.toLowerCase() === "flowchart";
}
