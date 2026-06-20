# Architecture & Development Guide

Welcome to the MarkFlow codebase. This document outlines the structural design, component hierarchy, and design decisions to help contributors quickly understand the project.

## Core Philosophy
MarkFlow is built with three driving principles:
1. **Performance First:** The editor should handle long-form documents without input latency.
2. **Distraction-Free:** The UI should get out of the way, focusing entirely on the content.
3. **Modular Open-Source Structure:** Components should be highly decoupled, allowing easy swaps (e.g., changing the Markdown parser) without breaking the system.

## State Management
We deliberately chose to avoid heavy global state libraries (like Redux or Zustand) to keep the project lightweight. 
- **Local Component State:** The main workspace state (raw markdown content, selected theme, mobile view mode) is managed at the top level in `App.tsx` and passed down via props.
- **Refs for DOM Manipulation:** Features needing direct DOM access (like the scroll-sync mechanism) use React Refs to avoid continuous re-renders.

## Component Hierarchy & Directory Structure
```
/src
  ├── components/
  │   ├── editor/           # The specialized text-entry view
  │   │   └── EditorPane.tsx # Custom textarea with fixed line numbers and sync support
  │   ├── preview/          # The rendering pipeline
  │   │   ├── PreviewPane.tsx   # Wrapper for scrolling and PDF export target
  │   │   ├── MarkdownRenderer.tsx # Intercepts custom blocks and renders markdown
  │   │   └── MermaidViewer.tsx    # Hooks into Mermaid.js for visual graph rendering
  │   └── ui/               # Dumb, pure presentational components
  │       ├── Toolbar.tsx             # Top navigation and theme controls
  │       ├── FloatingToolbar.tsx     # Export and copy actions rail
  │       └── MobileSegmentedControl.tsx # Mobile view toggler
  ├── hooks/                # Reusable custom React hooks
  │   └── useScrollSync.ts  # Bi-directional scroll observer mechanism
  ├── utils/                # Pure logic and helpers
  │   ├── cn.ts             # Tailwind class merging utility
  │   ├── constants.ts      # Default boilerplate content
  │   └── exporters.ts      # Logic mapping to html2pdf and Blob downloads
  ├── App.tsx               # Root view orchestrator
  └── index.css             # Tailwind base and CSS variable theme tokens
```

## The Rendering Pipeline
MarkFlow uses a layered combination of `react-markdown` to convert the `.md` string to a React component tree.
1. `remark-gfm`: Intercepts and parses GitHub Flavored Markdown (tables, strikethrough, task lists).
2. `rehype-raw`: Allows inline HTML to be rendered.
3. **Custom Components Override**: Inside `<MarkdownRenderer />`, we replace default tags (e.g., `<code>`) using the `components` prop. If the `<code>` block has the class `language-mermaid`, we swap it for our own `<MermaidViewer />` component.

## Scroll Synchronization Mechanism
The core challenge in a split-pane editor is scroll syncing. The `useScrollSync.ts` hook attaches listeners to both the Editor and the Preview scrollable containers.
- We measure `scrollTop / (scrollHeight - clientHeight)`.
- A temporary "lock" mechanism (`isScrollingRef`) prevents infinite loop reflows (where the editor moves the preview, which triggers a scroll event that tries to move the editor back). 

## Styling and Theming
- **Tailwind CSS v4:** Heavy use of standardized utility classes.
- **CSS Variables:** The multi-theme engine works by swapping class names (`dark`, `theme-slate`) on the `:root` HTML element. This changes the underlying CSS variables (defined in `index.css`), instantly updating all Tailwind color references (e.g., `bg-surface-container`).
