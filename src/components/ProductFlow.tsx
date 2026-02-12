import {
  Background,
  MarkerType,
  type Edge,
  type Node,
  Position,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const edges: Edge[] = [
  {
    id: "opsmaru-kritama",
    source: "opsmaru",
    target: "kritama",
    animated: true,
  },
  {
    id: "opsmaru-your-kritama",
    source: "opsmaru",
    target: "your-kritama",
    animated: true,
    style: { strokeDasharray: "5 5", stroke: "var(--color-info)" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--color-info)" },
  },
  {
    id: "kritama-memovee",
    source: "kritama",
    target: "memovee",
    animated: true,
  },
  {
    id: "memovee-web",
    source: "memovee",
    target: "memovee-web",
    animated: true,
  },
  {
    id: "memovee-api",
    source: "memovee",
    target: "memovee-api",
    animated: true,
  },
  {
    id: "memovee-mobile",
    source: "memovee",
    target: "memovee-mobile",
    animated: true,
  },
  {
    id: "your-kritama-your-app",
    source: "your-kritama",
    target: "your-app",
    animated: true,
    style: { strokeDasharray: "5 5", stroke: "var(--color-secondary)" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-secondary)",
    },
  },
];

const mainNodeStyle = {
  border: "1px solid var(--color-primary)",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem",
  background: "var(--color-base-200)",
  color: "var(--color-base-content)",
  boxShadow:
    "0 1px 0 0 color-mix(in oklab, var(--color-base-content) 18%, transparent)",
  fontWeight: 700,
  whiteSpace: "nowrap" as const,
  textAlign: "center" as const,
};

const branchNodeStyle = {
  border: "1px dashed var(--color-info)",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem",
  background:
    "color-mix(in oklab, var(--color-info) 14%, var(--color-base-100))",
  color: "var(--color-base-content)",
  fontWeight: 700,
  whiteSpace: "nowrap" as const,
  textAlign: "center" as const,
};

const appNodeStyle = {
  border: "1px dashed var(--color-secondary)",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem",
  background: "var(--color-base-100)",
  color: "var(--color-base-content)",
  boxShadow:
    "0 0 0 2px color-mix(in oklab, var(--color-secondary) 35%, transparent) inset",
  fontWeight: 700,
  whiteSpace: "nowrap" as const,
  textAlign: "center" as const,
};

const groupNodeStyle = {
  border: "1px solid color-mix(in oklab, var(--color-info) 45%, transparent)",
  borderRadius: "1rem",
  background:
    "color-mix(in oklab, var(--color-info) 8%, var(--color-base-100))",
};

const appGroupNodeStyle = {
  border:
    "1px solid color-mix(in oklab, var(--color-secondary) 40%, transparent)",
  borderRadius: "1rem",
  background:
    "color-mix(in oklab, var(--color-secondary) 8%, var(--color-base-100))",
};

const nodes: Node[] = [
  {
    id: "opsmaru",
    position: { x: 24, y: 164 },
    data: { label: "Opsmaru" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { ...mainNodeStyle, width: 220 },
  },
  {
    id: "intelligence",
    position: { x: 380, y: 52 },
    data: { label: "Intelligence" },
    type: "group",
    style: { ...groupNodeStyle, width: 320, height: 292, padding: "0.75rem" },
  },
  {
    id: "kritama",
    position: { x: 50, y: 44 },
    data: { label: "Memovee's Kritama" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    parentId: "intelligence",
    extent: "parent",
    style: { ...mainNodeStyle, width: 220 },
  },
  {
    id: "application",
    position: { x: 786, y: 12 },
    data: { label: "Application" },
    type: "group",
    style: {
      ...appGroupNodeStyle,
      width: 494,
      height: 348,
      padding: "0.75rem",
    },
  },
  {
    id: "memovee",
    position: { x: 50, y: 84 },
    data: { label: "Memovee" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    parentId: "application",
    extent: "parent",
    style: { ...mainNodeStyle, width: 220 },
  },
  {
    id: "your-kritama",
    position: { x: 50, y: 204 },
    data: { label: "Your Kritama" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    parentId: "intelligence",
    extent: "parent",
    style: { ...branchNodeStyle, width: 220 },
  },
  {
    id: "your-app",
    position: { x: 50, y: 244 },
    data: { label: "Your App" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    parentId: "application",
    extent: "parent",
    style: { ...appNodeStyle, width: 220 },
  },
  {
    id: "memovee-web",
    position: { x: 344, y: 20 },
    data: { label: "Chat" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    parentId: "application",
    extent: "parent",
    style: { ...mainNodeStyle, width: 120 },
  },
  {
    id: "memovee-api",
    position: { x: 344, y: 84 },
    data: { label: "API" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    parentId: "application",
    extent: "parent",
    style: { ...mainNodeStyle, width: 120 },
  },
  {
    id: "memovee-mobile",
    position: { x: 344, y: 148 },
    data: { label: "Mobile" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    parentId: "application",
    extent: "parent",
    style: { ...mainNodeStyle, width: 120 },
  },
];

export default function ProductFlow() {
  return (
    <div className="w-full border-y border-base-300 bg-base-100">
      <div className="relative h-[28rem] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
        >
          <Background
            color="color-mix(in oklab, var(--color-base-content) 14%, transparent)"
            gap={24}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
