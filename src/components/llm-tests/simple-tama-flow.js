import React from "react";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

function WorkflowMessageNode({ data }) {
  const e = React.createElement;
  const accent = data.accentColor ?? "var(--color-primary)";
  const sourcePosition = data.sourcePosition ?? Position.Right;
  const targetPosition = data.targetPosition ?? Position.Left;
  const targetInHeader = Boolean(data.targetInHeader);

  return e(
    "div",
    {
      className: "flex h-full flex-col rounded-2xl",
      style: {
        border: `1px solid ${accent}`,
        background: `color-mix(in oklab, ${accent} 8%, var(--color-base-100))`,
        boxShadow:
          "0 1px 0 0 color-mix(in oklab, var(--color-base-content) 18%, transparent)",
      },
    },
    e(
      "div",
      {
        className: "rounded-t-2xl px-3 py-2 font-mono text-xs font-semibold",
        style: {
          borderBottom: `1px solid color-mix(in oklab, ${accent} 55%, transparent)`,
          background: `color-mix(in oklab, ${accent} 14%, var(--color-base-100))`,
          color: "var(--color-base-content)",
        },
      },
      data.showTarget && targetInHeader
        ? e(Handle, {
            type: "target",
            position: targetPosition,
            className: "nodrag nopan",
            style: {
              width: 10,
              height: 10,
              border: "none",
              background: accent,
            },
          })
        : null,
      data.title,
    ),
    e(
      "div",
      {
        className: "relative flex rounded-b-2xl p-3",
        style: {
          background: "var(--color-base-100)",
        },
      },
      e(
        "p",
        {
          className: "pr-4 text-xs leading-relaxed",
          style: { color: "var(--color-base-content)" },
        },
        data.content,
      ),
      data.showTarget && !targetInHeader
        ? e(Handle, {
            type: "target",
            position: targetPosition,
            className: "nodrag nopan",
            style: {
              width: 10,
              height: 10,
              border: "none",
              background: accent,
            },
          })
        : null,
      data.showSource
        ? e(Handle, {
            type: "source",
            position: sourcePosition,
            className: "nodrag nopan",
            style: {
              width: 10,
              height: 10,
              border: "none",
              background: accent,
            },
          })
        : null,
    ),
  );
}

function GroupLabelNode({ data }) {
  const e = React.createElement;
  const accent = data.accentColor ?? "var(--color-base-content)";
  const sourcePosition = data.sourcePosition ?? Position.Right;
  const targetPosition = data.targetPosition ?? Position.Top;

  return e(
    "div",
    {
      className:
        "relative rounded-md px-2 py-1 font-mono text-xs font-semibold",
      style: {
        border:
          "1px solid color-mix(in oklab, var(--color-base-content) 24%, transparent)",
        background:
          "color-mix(in oklab, var(--color-base-100) 88%, transparent)",
        color: "var(--color-base-content)",
      },
    },
    data.showTarget
      ? e(Handle, {
          type: "target",
          position: targetPosition,
          className: "nodrag nopan",
          style: {
            width: 10,
            height: 10,
            border: "none",
            background: accent,
          },
        })
      : null,
    data.label,
    data.showSource
      ? e(Handle, {
          type: "source",
          position: sourcePosition,
          className: "nodrag nopan",
          style: {
            width: 10,
            height: 10,
            border: "none",
            background: accent,
          },
        })
      : null,
  );
}

function ChainStepNode({ data }) {
  const e = React.createElement;
  const accent = data.accentColor ?? "var(--color-secondary)";
  const dashed = Boolean(data.dashed);
  const showTopTarget = data.showTopTarget ?? true;
  const showRightTarget = data.showRightTarget ?? true;
  const showLeftTarget = data.showLeftTarget ?? true;
  const showRightSource = data.showRightSource ?? true;
  const showLeftSource = data.showLeftSource ?? true;
  const showBottomSource = data.showBottomSource ?? true;

  return e(
    "div",
    {
      className:
        "relative flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold",
      style: {
        border: dashed ? `1px dashed ${accent}` : `1px solid ${accent}`,
        background: `color-mix(in oklab, ${accent} 8%, var(--color-base-100))`,
        color: "var(--color-base-content)",
        minHeight: data.minHeight ?? undefined,
      },
    },
    showTopTarget
      ? e(Handle, {
          type: "target",
          id: "top",
          position: Position.Top,
          className: "nodrag nopan",
          style: {
            width: 10,
            height: 10,
            border: "none",
            background: accent,
          },
        })
      : null,
    showRightTarget
      ? e(Handle, {
          type: "target",
          id: "right-target",
          position: Position.Right,
          className: "nodrag nopan",
          style: {
            width: 10,
            height: 10,
            border: "none",
            background: accent,
            top: "68%",
          },
        })
      : null,
    showLeftTarget
      ? e(Handle, {
          type: "target",
          id: "left-target",
          position: Position.Left,
          className: "nodrag nopan",
          style: {
            width: 10,
            height: 10,
            border: "none",
            background: accent,
            top: "68%",
          },
        })
      : null,
    e("span", null, data.label),
    showRightSource
      ? e(Handle, {
          type: "source",
          id: "right",
          position: Position.Right,
          className: "nodrag nopan",
          style: {
            width: 10,
            height: 10,
            border: "none",
            background: accent,
            top: "34%",
          },
        })
      : null,
    showLeftSource
      ? e(Handle, {
          type: "source",
          id: "left-source",
          position: Position.Left,
          className: "nodrag nopan",
          style: {
            width: 10,
            height: 10,
            border: "none",
            background: accent,
            top: "34%",
          },
        })
      : null,
    showBottomSource
      ? e(Handle, {
          type: "source",
          id: "bottom",
          position: Position.Bottom,
          className: "nodrag nopan",
          style: {
            width: 10,
            height: 10,
            border: "none",
            background: accent,
          },
        })
      : null,
  );
}

const nodes = [
  {
    id: "memovee-chat",
    type: "group",
    position: { x: 80, y: 90 },
    data: { label: "[memovee-chat]" },
    style: {
      border:
        "1px solid color-mix(in oklab, var(--color-info) 40%, transparent)",
      borderRadius: "1rem",
      padding: "0.75rem",
      background:
        "color-mix(in oklab, var(--color-info) 8%, var(--color-base-100))",
      color: "var(--color-base-content)",
      width: 500,
      height: 760,
      fontWeight: 700,
    },
  },
  {
    id: "memovee-chat-label",
    type: "groupLabel",
    parentId: "memovee-chat",
    extent: "parent",
    position: { x: 16, y: 16 },
    data: { label: "memovee-chat" },
    draggable: false,
    selectable: false,
    style: {
      width: 140,
    },
  },
  {
    id: "chat-media-conversate",
    type: "group",
    position: { x: 960, y: 90 },
    data: { label: "[chat-media-conversate]" },
    style: {
      border:
        "1px solid color-mix(in oklab, var(--color-secondary) 45%, transparent)",
      borderRadius: "1rem",
      padding: "0.75rem",
      background:
        "color-mix(in oklab, var(--color-secondary) 8%, var(--color-base-100))",
      color: "var(--color-base-content)",
      width: 560,
      height: 500,
      fontWeight: 700,
    },
  },
  {
    id: "chat-media-conversate-label",
    type: "groupLabel",
    parentId: "chat-media-conversate",
    extent: "parent",
    position: { x: 16, y: 16 },
    data: { label: "chat-media-conversate" },
    draggable: false,
    selectable: false,
    style: {
      width: 190,
    },
  },
  {
    id: "context",
    type: "group",
    position: { x: 620, y: 700 },
    data: { label: "[context]" },
    style: {
      border:
        "1px solid color-mix(in oklab, var(--color-success) 40%, transparent)",
      borderRadius: "1rem",
      padding: "0.75rem",
      background:
        "color-mix(in oklab, var(--color-success) 8%, var(--color-base-100))",
      color: "var(--color-base-content)",
      fontWeight: 700,
      width: 300,
      height: 510,
    },
  },
  {
    id: "context-label",
    type: "groupLabel",
    parentId: "context",
    extent: "parent",
    position: { x: 16, y: 16 },
    data: { label: "context" },
    draggable: false,
    selectable: false,
    style: {
      width: 90,
    },
  },
  {
    id: "context-user-message",
    type: "workflowMessage",
    parentId: "context",
    extent: "parent",
    position: { x: 16, y: 68 },
    data: {
      title: "user-message",
      content: "Can you find me the top 10 movies in the database?",
      showTarget: true,
      accentColor: "var(--color-success)",
    },
    style: {
      width: 268,
    },
  },
  {
    id: "search-result",
    type: "workflowMessage",
    parentId: "context",
    extent: "parent",
    position: { x: 16, y: 188 },
    data: {
      title: "search-result",
      content: "Database result added to context",
      showTarget: true,
      targetPosition: Position.Right,
      targetInHeader: true,
      accentColor: "var(--color-success)",
    },
    style: {
      width: 268,
    },
  },
  {
    id: "create-artifact-result",
    type: "workflowMessage",
    parentId: "context",
    extent: "parent",
    position: { x: 16, y: 292 },
    data: {
      title: "create-artifact-result",
      content: "Artifact result added to context",
      showTarget: true,
      targetPosition: Position.Left,
      accentColor: "var(--color-success)",
    },
    style: {
      width: 268,
    },
  },
  {
    id: "reply",
    type: "workflowMessage",
    parentId: "context",
    extent: "parent",
    position: { x: 16, y: 396 },
    data: {
      title: "reply",
      content: "The reply generated by the LLM",
      showTarget: true,
      accentColor: "var(--color-success)",
    },
    style: {
      width: 268,
    },
  },
  {
    id: "user-message",
    type: "workflowMessage",
    parentId: "memovee-chat",
    extent: "parent",
    position: { x: 24, y: 78 },
    data: {
      title: "user-message",
      content: "Can you find me the top 10 movies in the database?",
      showSource: true,
      accentColor: "var(--color-primary)",
      sourcePosition: Position.Bottom,
    },
    style: {
      width: 430,
    },
  },
  {
    id: "routing",
    parentId: "memovee-chat",
    extent: "parent",
    position: { x: 154, y: 176 },
    sourcePosition: Position.Right,
    targetPosition: Position.Top,
    data: {
      label: "1. routing",
    },
    style: {
      border: "1px dashed var(--color-info)",
      borderRadius: "0.75rem",
      padding: "0.6rem 0.9rem",
      background:
        "color-mix(in oklab, var(--color-info) 10%, var(--color-base-100))",
      color: "var(--color-base-content)",
      fontWeight: 700,
      width: 170,
      textAlign: "center",
    },
  },
  {
    id: "response-with-artifact",
    type: "workflowMessage",
    parentId: "memovee-chat",
    extent: "parent",
    position: { x: 24, y: 360 },
    data: {
      title: "response-with-artifact",
      content: 'Run "Memovee Chat with Artifact Reply" Chain',
      showTarget: true,
      targetPosition: Position.Right,
      showSource: true,
      sourcePosition: Position.Bottom,
      accentColor: "var(--color-primary)",
    },
    style: {
      width: 430,
    },
  },
  {
    id: "memovee-chat-with-artifact-reply",
    type: "group",
    parentId: "memovee-chat",
    extent: "parent",
    position: { x: 100, y: 462 },
    targetPosition: Position.Top,
    data: { label: "Memovee Chat with Artifact Reply" },
    style: {
      border:
        "1px solid color-mix(in oklab, var(--color-primary) 45%, transparent)",
      borderRadius: "0.75rem",
      padding: "0.75rem",
      background:
        "color-mix(in oklab, var(--color-primary) 6%, var(--color-base-100))",
      color: "var(--color-base-content)",
      width: 300,
      height: 238,
      fontWeight: 700,
    },
  },
  {
    id: "memovee-chat-with-artifact-reply-label",
    type: "groupLabel",
    parentId: "memovee-chat-with-artifact-reply",
    extent: "parent",
    position: { x: 12, y: 12 },
    data: {
      label: "Memovee Chat with Artifact Reply",
      showTarget: true,
      targetPosition: Position.Top,
      accentColor: "var(--color-primary)",
    },
    draggable: false,
    selectable: false,
    style: {
      width: 245,
    },
  },
  {
    id: "create-artifact",
    type: "chainStep",
    parentId: "memovee-chat-with-artifact-reply",
    extent: "parent",
    position: { x: 28, y: 86 },
    data: {
      label: "4. create-artifact",
      accentColor: "var(--color-primary)",
      showTopTarget: false,
      showLeftTarget: false,
      showLeftSource: false,
    },
    style: {
      width: 228,
    },
  },
  {
    id: "stream-response",
    type: "chainStep",
    parentId: "memovee-chat-with-artifact-reply",
    extent: "parent",
    position: { x: 28, y: 156 },
    data: {
      label: "5. stream-response",
      accentColor: "var(--color-primary)",
      showRightTarget: false,
      showLeftTarget: false,
      showRightSource: true,
      showLeftSource: false,
      showBottomSource: false,
    },
    style: {
      width: 228,
    },
  },
  {
    id: "chat-media-search",
    type: "workflowMessage",
    parentId: "chat-media-conversate",
    extent: "parent",
    position: { x: 24, y: 78 },
    data: {
      title: "chat-media-search",
      content: 'Runs "Chat Media Search" Chain',
      showTarget: true,
      showSource: true,
      sourcePosition: Position.Bottom,
      accentColor: "var(--color-secondary)",
    },
    style: {
      width: 510,
    },
  },
  {
    id: "database",
    type: "workflowMessage",
    position: { x: 620, y: 376 },
    data: {
      title: "database",
      content: "Execute generated query",
      showTarget: true,
      targetPosition: Position.Right,
      targetInHeader: true,
      showSource: true,
      sourcePosition: Position.Right,
      accentColor: "var(--color-secondary)",
    },
    style: {
      width: 300,
    },
  },
  {
    id: "hud",
    type: "workflowMessage",
    position: { x: 620, y: 528 },
    data: {
      title: "hud",
      content: "Render result view",
      showTarget: true,
      targetPosition: Position.Left,
      targetInHeader: true,
      showSource: true,
      sourcePosition: Position.Left,
      accentColor: "var(--color-secondary)",
    },
    style: {
      width: 300,
    },
  },
  {
    id: "chat-media-search-chain",
    type: "group",
    parentId: "chat-media-conversate",
    extent: "parent",
    position: { x: 129, y: 188 },
    targetPosition: Position.Top,
    data: { label: "Chat Media Search" },
    style: {
      border:
        "1px solid color-mix(in oklab, var(--color-secondary) 45%, transparent)",
      borderRadius: "0.75rem",
      padding: "0.75rem",
      background:
        "color-mix(in oklab, var(--color-secondary) 6%, var(--color-base-100))",
      color: "var(--color-base-content)",
      width: 300,
      height: 270,
      fontWeight: 700,
    },
  },
  {
    id: "chat-media-search-chain-label",
    type: "groupLabel",
    parentId: "chat-media-search-chain",
    extent: "parent",
    position: { x: 12, y: 12 },
    data: {
      label: "Chat Media Search",
      showTarget: true,
      targetPosition: Position.Top,
      accentColor: "var(--color-secondary)",
    },
    draggable: false,
    selectable: false,
    style: {
      width: 150,
    },
  },
  {
    id: "query-database",
    type: "chainStep",
    parentId: "chat-media-search-chain",
    extent: "parent",
    position: { x: 28, y: 98 },
    data: {
      label: "2. query-database",
      accentColor: "var(--color-secondary)",
      minHeight: 56,
      showTopTarget: false,
      showRightTarget: false,
      showRightSource: false,
    },
    style: {
      width: 228,
    },
  },
  {
    id: "chain-routing",
    parentId: "chat-media-search-chain",
    extent: "parent",
    position: { x: 28, y: 200 },
    sourcePosition: Position.Left,
    targetPosition: Position.Top,
    data: { label: "3. routing" },
    style: {
      border: "1px dashed var(--color-secondary)",
      borderRadius: "0.75rem",
      padding: "0.55rem 0.85rem",
      background:
        "color-mix(in oklab, var(--color-secondary) 8%, var(--color-base-100))",
      color: "var(--color-base-content)",
      fontWeight: 700,
      width: 228,
      textAlign: "center",
    },
  },
];

const edges = [
  {
    id: "user-message-to-routing",
    source: "user-message",
    target: "routing",
    animated: true,
    style: { stroke: "var(--color-primary)" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-primary)",
    },
  },
  {
    id: "user-message-to-context-user-message",
    source: "user-message",
    target: "context-user-message",
    type: "simplebezier",
    animated: true,
    style: { stroke: "var(--color-success)" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-success)",
    },
  },
  {
    id: "routing-to-chat-media-search",
    source: "routing",
    target: "chat-media-search",
    animated: true,
    style: { stroke: "var(--color-primary)" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-primary)",
    },
  },
  {
    id: "chat-media-search-to-chat-media-search-chain",
    source: "chat-media-search",
    target: "chat-media-search-chain-label",
    type: "simplebezier",
    animated: true,
    zIndex: 10,
    style: {
      stroke: "var(--color-secondary)",
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-secondary)",
    },
  },
  {
    id: "query-database-to-chain-routing",
    source: "query-database",
    sourceHandle: "bottom",
    target: "chain-routing",
    animated: true,
    style: { stroke: "var(--color-secondary)" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-secondary)",
    },
  },
  {
    id: "response-with-artifact-to-chain",
    source: "response-with-artifact",
    target: "memovee-chat-with-artifact-reply-label",
    type: "simplebezier",
    animated: true,
    style: { stroke: "var(--color-primary)", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-primary)",
    },
  },
  {
    id: "create-artifact-to-stream-response",
    source: "create-artifact",
    sourceHandle: "bottom",
    target: "stream-response",
    animated: true,
    style: { stroke: "var(--color-primary)" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-primary)",
    },
  },
  {
    id: "chain-routing-to-response-with-artifact",
    source: "chain-routing",
    target: "response-with-artifact",
    type: "simplebezier",
    animated: true,
    style: { stroke: "var(--color-primary)" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-primary)",
    },
  },
  {
    id: "query-database-to-database",
    source: "query-database",
    sourceHandle: "left-source",
    target: "database",
    type: "simplebezier",
    animated: true,
    style: { stroke: "var(--color-secondary)", strokeDasharray: "5 4" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-secondary)",
    },
  },
  {
    id: "create-artifact-to-hud",
    source: "create-artifact",
    sourceHandle: "right",
    target: "hud",
    type: "simplebezier",
    animated: true,
    style: { stroke: "var(--color-secondary)", strokeDasharray: "5 4" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-secondary)",
    },
  },
  {
    id: "database-to-query-database",
    source: "database",
    target: "query-database",
    targetHandle: "left-target",
    type: "simplebezier",
    animated: true,
    style: { stroke: "var(--color-secondary)", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-secondary)",
    },
  },
  {
    id: "hud-to-create-artifact",
    source: "hud",
    target: "create-artifact",
    targetHandle: "right-target",
    type: "simplebezier",
    animated: true,
    style: { stroke: "var(--color-secondary)", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-secondary)",
    },
  },
  {
    id: "query-database-to-search-result",
    source: "query-database",
    sourceHandle: "left-source",
    target: "search-result",
    type: "simplebezier",
    animated: true,
    style: { stroke: "var(--color-success)" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-success)",
    },
  },
  {
    id: "create-artifact-to-create-artifact-result",
    source: "create-artifact",
    sourceHandle: "right",
    target: "create-artifact-result",
    type: "simplebezier",
    animated: true,
    style: { stroke: "var(--color-success)" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-success)",
    },
  },
  {
    id: "stream-response-to-reply",
    source: "stream-response",
    sourceHandle: "right",
    target: "reply",
    type: "simplebezier",
    animated: true,
    style: { stroke: "var(--color-success)" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--color-success)",
    },
  },
];

export default function SimpleTamaFlow() {
  const e = React.createElement;
  const nodeTypes = {
    workflowMessage: WorkflowMessageNode,
    groupLabel: GroupLabelNode,
    chainStep: ChainStepNode,
  };

  return e(
    "div",
    {
      className: "simple-tama-flow w-full border-y border-base-300 bg-base-100",
    },
    e(
      "div",
      { className: "relative h-[32rem] w-full sm:h-[42rem] lg:h-[52rem]" },
      e(
        ReactFlow,
        {
          nodes,
          edges,
          nodeTypes,
          fitView: true,
          fitViewOptions: { padding: 0.12 },
          proOptions: { hideAttribution: true },
          nodesDraggable: false,
          nodesConnectable: false,
          elementsSelectable: false,
          panOnDrag: true,
          preventScrolling: false,
          zoomOnScroll: false,
          zoomOnPinch: false,
          zoomOnDoubleClick: false,
        },
        e(Background, {
          color:
            "color-mix(in oklab, var(--color-base-content) 14%, transparent)",
          gap: 24,
        }),
        e(Controls, {
          showFitView: false,
          showInteractive: false,
          position: "bottom-right",
        }),
      ),
    ),
  );
}
