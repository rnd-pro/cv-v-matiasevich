import styles from '../../common-styles/styles.css.js';

export default /*css*/ `
${styles}

body {
  background: var(--sn-bg, #f3f5f8);
  color: var(--sn-text, #1f2937);
}

body:has(.pulse-screen) {
  padding-left: 0;
  --pulse-workspace-block-size: calc(100vh - var(--calc-top-pan-height));
}

@supports (height: 100dvh) {
  body:has(.pulse-screen) {
    --pulse-workspace-block-size: calc(100dvh - var(--calc-top-pan-height));
  }
}

side-panel[disabled],
side-panel[hidden] {
  display: none;
}

body:has(.pulse-screen) footer {
  display: none;
}

header,
footer {
  background: color-mix(in srgb, var(--sn-node-bg, #fff) 92%, transparent);
  color: var(--sn-text, #1f2937);
  border-color: var(--sn-node-border, #cbd5e1);
}

body:has(.pulse-screen) header {
  justify-content: space-between;
  font-size: clamp(0.86rem, 2.2vw, 1.05rem);
  gap: var(--gap-mid);
  padding-inline: var(--gap-max);
  z-index: var(--pulse-header-z, 20020);
}

.pulse-header-title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pulse-header-menu-button {
  display: none;
}

.pulse-theme-widget {
  flex: 0 0 auto;
  margin-inline-start: 0;
  --sn-theme-widget-z: var(--pulse-theme-widget-z, 20030);
}

.pulse-locale-toggle {
  flex: 0 0 auto;
  --sn-segmented-radius: var(--sn-button-radius, 6px);
  --sn-segmented-font-size: 0.72rem;
  --sn-segmented-padding: 4px 8px;
  --sn-segmented-item-min-height: 28px;
  --sn-segmented-selected-bg: var(--sn-node-selected, #0056b3);
}

.pulse-locale-toggle > button {
  min-inline-size: 32px;
  letter-spacing: 0;
}

.pulse-locale-toggle > slot {
  display: none;
}

.pulse-theme-widget .ctw-trigger {
  display: inline-flex;
}

.pulse-header-menu-button,
.pulse-theme-widget .ctw-trigger {
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 30px;
  padding: 4px 9px;
  border: 1px solid var(--sn-button-border, var(--sn-node-border, #cbd5e1));
  border-radius: var(--sn-button-radius, 6px);
  background: var(--sn-button-bg, var(--sn-node-bg, #fff));
  color: var(--sn-button-color, var(--sn-text, #1f2937));
  font: inherit;
  cursor: pointer;
}

.pulse-header-menu-button .material-symbols-outlined {
  font-size: var(--sn-shell-menu-action-icon-size, var(--sn-layout-header-icon-size, 16px));
  line-height: 1;
}

.pulse-header-menu-button:hover,
.pulse-header-menu-button:focus-visible,
.pulse-theme-widget .ctw-trigger:hover,
.pulse-theme-widget .ctw-trigger[active] {
  background: var(--sn-button-hover-bg, var(--sn-node-hover, #e5e7eb));
}

main > article {
  max-width: none;
  min-height: var(--pulse-workspace-block-size);
  padding: 0;
}

.pulse-screen {
  position: relative;
  display: block;
  min-height: var(--pulse-workspace-block-size);
  overflow: hidden;
  background: var(--sn-bg, #f3f5f8);
}

.pulse-workspace {
  display: block;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: var(--pulse-workspace-block-size);
  background: var(--sn-bg, #f3f5f8);
  color: var(--sn-text, #1f2937);
}

portfolio-workspace,
.portfolio-layout,
portfolio-tree-panel,
portfolio-graph-panel,
portfolio-viewer-panel,
portfolio-theme-panel,
.portfolio-tree,
.portfolio-viewer,
.portfolio-theme-editor,
.portfolio-canvas,
.portfolio-flat-graph {
  min-width: 0;
  min-height: 0;
}

portfolio-workspace,
.portfolio-layout,
portfolio-tree-panel,
portfolio-graph-panel,
portfolio-viewer-panel,
portfolio-theme-panel {
  inline-size: 100%;
  block-size: 100%;
}

portfolio-graph-panel {
  position: relative;
}

portfolio-graph-panel[data-loading]::after {
  content: '';
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  inline-size: 30px;
  block-size: 30px;
  margin: -15px 0 0 -15px;
  border: 2px solid color-mix(in oklab, var(--sn-text, #f0f0f0) 22%, transparent);
  border-block-start-color: var(--sn-node-selected, #4a9eff);
  border-radius: 50%;
  pointer-events: none;
  z-index: 3;
  animation: portfolio-graph-loading-spin 0.72s linear infinite;
}

@keyframes portfolio-graph-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.portfolio-layout layout-node .panel-content {
  padding: 0;
  overflow: hidden;
}

.portfolio-tree,
.portfolio-viewer,
.portfolio-theme-editor {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

.portfolio-tree {
  --sn-icon-font: 'Material Symbols Outlined';
  --sn-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --sn-font-family: var(--sn-font);
  --sn-tree-panel-content-padding: 6px;
  --sn-tree-panel-gap: 4px;
  --sn-tree-panel-indent: 14px;
  --sn-tree-toggle-width: 18px;
  --sn-tree-icon-width: 18px;
  --sn-tree-row-height: 26px;
  --sn-tree-row-min-height: 26px;
  --sn-tree-row-padding-block: 1px;
  --sn-tree-panel-row-min-height: 26px;
  --sn-tree-row-radius: 5px;
  --sn-tree-icon-size: 16px;
  --sn-tree-panel-icon-size: 16px;
  --sn-tree-label-color: var(--sn-text, #f0f0f0);
  --sn-tree-panel-label-weight: 500;
  --sn-tree-row-selected-bg: color-mix(in oklab, var(--sn-node-selected, #4a9eff) 22%, transparent);
  --sn-tree-row-hover-bg: color-mix(in oklab, var(--sn-node-selected, #4a9eff) 12%, transparent);
}

.portfolio-tree .sn-tree-panel-toolbar {
  align-items: center;
}

.portfolio-tree .sn-tree-panel-filter {
  min-height: 26px;
}

.portfolio-tree .sn-tree-row {
  grid-template-columns: var(--sn-tree-toggle-width) var(--sn-tree-icon-width) minmax(0, 1fr);
  column-gap: 5px;
}

.portfolio-tree .sn-tree-toggle,
.portfolio-tree .sn-tree-icon,
.portfolio-tree .sn-tree-panel-toolbar-icon {
  font-family: var(--sn-icon-font);
  font-weight: normal;
  font-style: normal;
  text-transform: none;
  letter-spacing: 0;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  font-feature-settings: 'liga';
}

.portfolio-tree .sn-tree-kind,
.portfolio-tree .sn-tree-badges {
  display: none;
}

.portfolio-canvas {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  --sn-node-radius: 8px;
  --sn-port-outline: var(--sn-conn-dot-stroke);
}

.portfolio-flat-graph {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

.portfolio-canvas[hidden],
.portfolio-flat-graph[hidden] {
  display: none !important;
}

.portfolio-canvas .sn-conn-dot,
.portfolio-canvas .sn-free-dot {
  fill: var(--sn-conn-dot-fill);
  stroke: var(--sn-conn-dot-stroke);
}

.portfolio-canvas .sn-conn-path {
  stroke: var(--sn-conn-color);
}

.portfolio-canvas port-item .sn-socket {
  --socket-color: var(--sn-conn-color);
}

.portfolio-canvas port-item .sn-socket::after {
  background: var(--socket-color, var(--sn-conn-color));
  border-color: var(--sn-conn-dot-stroke);
}

.portfolio-canvas graph-node[node-id="profile/photo"] {
  --sn-shape-disc-stroke: transparent;
  --sn-shape-stroke-width: 0;
}

.portfolio-canvas graph-node[node-id="profile/photo"] .sn-node-body {
  text-align: center;
}

.portfolio-canvas graph-node[node-type="directory"] {
  --sn-node-min-width: 108px;
  --sn-node-max-width: 108px;
  --sn-node-circle-size: 108px;
}

.portfolio-canvas graph-node[node-type="bio"],
.portfolio-canvas graph-node[node-type="skill"] {
  --sn-node-min-width: 290px;
  --sn-node-max-width: 320px;
}

.portfolio-canvas graph-node[node-type="project"] {
  --sn-node-min-width: 300px;
  --sn-node-max-width: 330px;
}

.portfolio-canvas graph-node[node-type="pulse"] {
  --sn-node-min-width: 260px;
  --sn-node-max-width: 300px;
}

.portfolio-canvas graph-node[node-type="project"] .sn-node-media {
  block-size: 108px;
}

footer a {
  color: currentColor;
  font-weight: 700;
}

.article-page {
  max-width: 760px;
  margin: 0 auto;
  padding-block: clamp(24px, 6vh, 72px);
  color: var(--sn-text, #1f2937);
}

.article-page h1 {
  margin: 0 0 18px;
  font-size: clamp(32px, 6vw, 56px);
  line-height: 1;
}

.article-page p {
  color: var(--sn-text-dim, #4b5563);
  font-size: 18px;
  line-height: 1.65;
}

.article-page code {
  padding: 2px 6px;
  border-radius: 6px;
  background: var(--sn-node-hover, #e5e7eb);
  color: var(--sn-text, #1f2937);
}

.article-kicker {
  margin: 0 0 12px;
  color: var(--sn-node-selected, #3276d4) !important;
  font-size: 13px !important;
  font-weight: 800;
  line-height: 1.2 !important;
  text-transform: uppercase;
}

@media (max-width: 640px) {
  body {
    padding-left: 0;
  }

  .pulse-screen {
    min-height: var(--pulse-workspace-block-size);
  }

  .pulse-workspace {
    height: auto;
    min-height: var(--pulse-workspace-block-size);
  }
}

@media (max-width: 520px) {
  header {
    font-size: 1rem;
  }

  body:has(.pulse-screen) header {
    gap: var(--pulse-mobile-header-gap, 10px);
    padding-inline: var(--sn-layout-header-padding-inline, 14px);
  }

  .pulse-header-menu-button {
    display: inline-flex;
  }

  .pulse-header-menu-button,
  .pulse-theme-widget .ctw-trigger {
    inline-size: var(--pulse-header-action-size, 44px);
    block-size: var(--pulse-header-action-size, 44px);
    min-inline-size: var(--pulse-header-action-size, 44px);
    min-block-size: var(--pulse-header-action-size, 44px);
    padding: 0;
  }

  .pulse-locale-toggle {
    --sn-segmented-padding: 4px 7px;
    --sn-segmented-item-min-height: 32px;
  }

  .pulse-locale-toggle > button {
    min-inline-size: 30px;
  }

  .pulse-header-title {
    font-size: 0.88rem;
  }

  main > article {
    padding: 14px;
  }

  main > article {
    padding: 0;
  }
}
`;
