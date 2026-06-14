<script lang="ts">
  import { vscode } from "../services/index";
  import ContextMenu, { type MenuAction } from "./ContextMenu.svelte";
  import Tooltip from "./Tooltip.svelte";

  interface Props {
    labelType?: string;
    clickBehavior?: string;
    copyContent?: string;
    iconCode: string;
    iconUnicode: string;
    iconLabel: string;
    iconStyle: string;
    iconStylePrefix: string;
    iconStyles?: string[];
    faVersion?: string;
    svgPath?: string;
    svgWidth?: number;
    svgHeight?: number;
    iconSize?: number;
    addedIn?: string;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onLogRecent?: () => void;
  }

  let {
    labelType = "iconClassname",
    clickBehavior = "copy",
    copyContent = "classname",
    iconCode,
    iconUnicode,
    iconLabel,
    iconStyle,
    iconStylePrefix,
    iconStyles = [],
    faVersion = "v6",
    svgPath = "",
    svgWidth = 512,
    svgHeight = 512,
    iconSize = 1,
    addedIn,
    isFavorite = false,
    onToggleFavorite,
    onLogRecent,
  }: Props = $props();

  let menuOpen = $state(false);
  let menuX = $state(0);
  let menuY = $state(0);

  let tooltipVisible = $state(false);
  let tooltipX = $state(0);
  let tooltipY = $state(0);

  const NEW_THRESHOLDS: Record<string, string> = { v6: "6.6.0", v7: "7.0.0" };
  let isNew = $derived(() => {
    if (!addedIn || faVersion === "v5") return false;
    const threshold = NEW_THRESHOLDS[faVersion];
    if (!threshold) return false;
    const toNum = (v: string) => v.split(".").map(Number);
    const [ma, mi, pa] = toNum(addedIn);
    const [tb, tm, tp] = toNum(threshold);
    if (ma !== tb) return ma > tb;
    if (mi !== tm) return mi > tm;
    return pa >= tp;
  });

  function handleMouseEnter(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const TOOLTIP_W = 220;
    const TOOLTIP_H = 80;
    const GAP = 4;

    let x = rect.left + rect.width / 2 - TOOLTIP_W / 2;
    if (x + TOOLTIP_W > window.innerWidth) x = window.innerWidth - TOOLTIP_W - 4;
    if (x < 4) x = 4;

    let y = rect.bottom + GAP;
    if (y + TOOLTIP_H > window.innerHeight) y = rect.top - TOOLTIP_H - GAP;

    tooltipX = x;
    tooltipY = y;
    tooltipVisible = true;
  }

  function handleMouseLeave() {
    tooltipVisible = false;
  }

  function copyText(text: string, label = "Copied to clipboard!") {
    navigator.clipboard.writeText(text).then(() => {
      vscode.postMessage({ command: "onInfo", content: { message: label } });
    });
  }

  function toReactIconName(name: string): string {
    return "fa" + name.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  }

  function getSvgContent(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}"><path d="${svgPath}"/></svg>`;
  }

  function getContent(): string {
    switch (copyContent) {
      case "html": return `<i class="${iconCode}"></i>`;
      case "unicode": return iconUnicode;
      case "vue": return `['${iconStylePrefix}', '${iconLabel}']`;
      case "react": return `<FontAwesomeIcon icon={${toReactIconName(iconLabel)}} />`;
      case "svg": return svgPath ? getSvgContent() : iconCode;
      default: return iconCode;
    }
  }

  function getContentLabel(): string {
    switch (copyContent) {
      case "html": return "HTML tag copied!";
      case "unicode": return "Unicode copied!";
      case "vue": return "Vue array copied!";
      case "react": return "React JSX copied!";
      case "svg": return "SVG copied!";
      default: return "Class name copied!";
    }
  }

  function insertAtCursor() {
    vscode.postMessage({
      command: "insert-at-cursor",
      content: { text: getContent() },
    });
  }

  function handlePrimaryClick() {
    onLogRecent?.();
    if (clickBehavior === "insert") {
      insertAtCursor();
    } else {
      copyText(getContent(), getContentLabel());
    }
  }

  function openContextMenu(e: MouseEvent) {
    e.preventDefault();
    menuX = e.clientX;
    menuY = e.clientY;
    menuOpen = true;
  }

  function getContextActions(): MenuAction[] {
    const actions: MenuAction[] = [
      {
        label: "Copy class name",
        action: () => copyText(iconCode, "Class name copied!"),
      },
      {
        label: "Copy HTML tag",
        action: () => copyText(`<i class="${iconCode}"></i>`, "HTML tag copied!"),
      },
      {
        label: "Copy Vue array",
        action: () => copyText(`['${iconStylePrefix}', '${iconLabel}']`, "Vue array copied!"),
      },
      {
        label: "Copy React JSX",
        action: () => copyText(`<FontAwesomeIcon icon={${toReactIconName(iconLabel)}} />`, "React JSX copied!"),
      },
      {
        label: "Insert at cursor",
        action: insertAtCursor,
      },
    ];
    if (faVersion !== "v5" && svgPath) {
      actions.push({
        label: "Copy SVG",
        action: () => copyText(getSvgContent(), "SVG copied!"),
      });
    }
    actions.push({
      label: "Open on fontawesome.com",
      action: () => vscode.postMessage({ command: "open-external", content: { url: `https://fontawesome.com/icons/${iconLabel}` } }),
    });
    return actions;
  }
</script>

{#if menuOpen}
  <ContextMenu
    x={menuX}
    y={menuY}
    actions={getContextActions()}
    onclose={() => (menuOpen = false)}
  />
{/if}

{#if tooltipVisible}
  <Tooltip
    x={tooltipX}
    y={tooltipY}
    {iconLabel}
    {iconCode}
    {iconUnicode}
    {iconStyles}
  />
{/if}

<div
  role="button"
  tabindex="0"
  class="listItem"
  style="--icon-scale: {iconSize}"
  onclick={handlePrimaryClick}
  oncontextmenu={openContextMenu}
  onkeydown={(e) => e.key === "Enter" && handlePrimaryClick()}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
>
  <span class="inner">
    <div class="icon-container" style="position: relative;">
      {#if isNew()}
        <span class="badge-new">New</span>
      {/if}
      {#if faVersion !== "v5" && svgPath}
        <svg
          viewBox="0 0 {svgWidth} {svgHeight}"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={svgPath} />
        </svg>
      {:else}
        <i class={iconCode}></i>
      {/if}
    </div>
    <div class="name-container">
      {#if labelType === "iconClassname"}
        <code>{iconCode}</code>
      {:else if labelType === "iconUnicode"}
        <code>{iconUnicode}</code>
      {/if}
    </div>
    <button
      class="btn-favorite"
      class:active={isFavorite}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      onclick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }}
      onkeydown={(e) => e.stopPropagation()}
      tabindex="-1"
      aria-label="toggle favorite"
    >{isFavorite ? "★" : "☆"}</button>
  </span>
</div>

<style>
  .listItem {
    width: 100%;
    margin-bottom: 5px;
    position: relative;
  }

  .listItem .inner:hover {
    background-color: var(--vscode-textSeparator-foreground);
  }

  .listItem .inner {
    width: 100%;
    height: calc(14vw * var(--icon-scale, 1));
    overflow: hidden;
    background-color: var(--vscode-input-background);
    box-shadow: 0px 0px 12px rgb(0 0 0 / 6%);
    transition: all 0.3s ease-in-out;
    display: flex;
    align-items: center;
  }

  .listItem .inner .name-container {
    flex: 1;
    min-width: 0;
    padding: 0 5px;
    overflow: hidden;
  }

  .listItem .inner i {
    font-size: calc(10vw * var(--icon-scale, 1));
  }

  .listItem .inner svg {
    height: calc(10vw * var(--icon-scale, 1));
    width: auto;
    max-width: 100%;
  }

  .listItem .inner code {
    font-size: 3vw;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 2px;
    border-radius: 3px;
    background-color: var(--vscode-editor-background);
  }

  .listItem .icon-container {
    flex: 0 0 calc(12vw * var(--icon-scale, 1));
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.5rem;
  }

  .badge-new {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 7px;
    font-weight: bold;
    padding: 1px 3px;
    background: var(--vscode-activityBarBadge-background, #0078d4);
    color: var(--vscode-activityBarBadge-foreground, #fff);
    border-radius: 2px;
    z-index: 2;
    pointer-events: none;
    line-height: 1.4;
  }

  .btn-favorite {
    flex: 0 0 auto;
    width: auto;
    background: none;
    border: none;
    padding: 0 8px;
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    color: var(--vscode-descriptionForeground);
    opacity: 0;
    transition: opacity 0.15s;
    align-self: center;
  }

  .listItem:hover .btn-favorite,
  .btn-favorite.active {
    opacity: 1;
  }

  .btn-favorite.active {
    color: #f0c040;
  }
</style>
