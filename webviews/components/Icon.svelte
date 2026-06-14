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
  }: Props = $props();

  // Short name: "fa-address-book" (last part of the full class string)
  let iconShortName = $derived(iconCode.split(" ").pop() ?? iconCode);

  let menuOpen = $state(false);
  let menuX = $state(0);
  let menuY = $state(0);

  let tooltipVisible = $state(false);
  let tooltipX = $state(0);
  let tooltipY = $state(0);

  function handleMouseEnter(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const TOOLTIP_W = 220;
    const TOOLTIP_H = 80;
    const GAP = 4;

    // Horizontal: center below the icon, clamp to viewport edges
    let x = rect.left + rect.width / 2 - TOOLTIP_W / 2;
    if (x + TOOLTIP_W > window.innerWidth) x = window.innerWidth - TOOLTIP_W - 4;
    if (x < 4) x = 4;

    // Vertical: below the icon by default, above if near the bottom
    let y = rect.bottom + GAP;
    if (y + TOOLTIP_H > window.innerHeight) {
      y = rect.top - TOOLTIP_H - GAP;
    }

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

  function getContent(): string {
    switch (copyContent) {
      case "html": return `<i class="${iconCode}"></i>`;
      case "unicode": return iconUnicode;
      case "vue": return `['${iconStylePrefix}', '${iconLabel}']`;
      default: return iconCode;
    }
  }

  function getContentLabel(): string {
    switch (copyContent) {
      case "html": return "HTML tag copied!";
      case "unicode": return "Unicode copied!";
      case "vue": return "Vue array copied!";
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
    return [
      {
        label: "Copy class name",
        action: () => copyText(iconCode, "Class name copied!"),
      },
      {
        label: "Copy HTML tag",
        action: () =>
          copyText(`<i class="${iconCode}"></i>`, "HTML tag copied!"),
      },
      {
        label: "Copy Vue array",
        action: () =>
          copyText(`['${iconStylePrefix}', '${iconLabel}']`, "Vue array copied!"),
      },
      {
        label: "Insert at cursor",
        action: insertAtCursor,
      },
    ];
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
    iconLabel={iconLabel}
    iconCode={iconCode}
    iconUnicode={iconUnicode}
    iconStyles={iconStyles}
  />
{/if}

<div
  role="button"
  tabindex="0"
  class="icon"
  onclick={handlePrimaryClick}
  oncontextmenu={openContextMenu}
  onkeydown={(e) => e.key === "Enter" && handlePrimaryClick()}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
>
  <span class="inner">
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
    <div class="name-container">
      {#if labelType === "iconClassname"}
        <code>{iconShortName}</code>
      {:else if labelType === "iconUnicode"}
        <code>{iconUnicode}</code>
      {/if}
    </div>
  </span>
</div>

<style>
  .icon {
    display: inline-block;
    width: 31%;
    margin: 0 1% 4px;
  }

  @media only screen and (max-width: 250px) {
    .icon {
      width: 48%;
      margin: 0 1% 4px;
    }
  }

  @media only screen and (max-width: 215px) {
    .icon {
      width: 98%;
      margin: 0 1% 4px;
    }

    .icon .inner {
      height: 100%;
    }

    .icon .inner i,
    .icon .inner svg {
      font-size: 20vw;
      height: 20vw;
      padding: 10px 10px 3% 10px;
    }

    .icon .inner code {
      font-size: 4vw;
    }
  }

  .icon .inner:hover {
    background-color: var(--vscode-textSeparator-foreground);
  }

  .icon .inner {
    display: inline-block;
    text-align: center;
    width: 100%;
    overflow: hidden;
    background-color: var(--vscode-input-background);
    box-shadow: 0px 0px 12px rgb(0 0 0 / 6%);
    transition: all 0.3s ease-in-out;
    padding-bottom: 10px;
  }

  .icon .inner .name-container {
    margin: 0px 5px 0px 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon .inner i {
    font-size: 15vw;
    padding: 10px 10px 3% 10px;
    display: block;
  }

  .icon .inner svg {
    height: 15vw;
    width: auto;
    max-width: 80%;
    padding: 10px 0 3% 0;
    display: block;
    margin: 0 auto;
  }

  .icon .inner code {
    font-size: 3vw;
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    padding: 2px;
    border-radius: 3px;
    background-color: var(--vscode-editor-background);
  }
</style>
