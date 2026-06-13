<script lang="ts">
  import { vscode } from "../services/index";

  interface Props {
    labelType?: string;
    iconCode: string;
    iconUnicode: string;
    iconLabel: string;
    iconStyle: string;
    iconStylePrefix: string;
    faVersion?: string;
    svgPath?: string;
    svgWidth?: number;
    svgHeight?: number;
  }

  let {
    labelType = "iconClassname",
    iconCode,
    iconUnicode,
    iconLabel,
    iconStyle,
    iconStylePrefix,
    faVersion = "v6",
    svgPath = "",
    svgWidth = 512,
    svgHeight = 512,
  }: Props = $props();

  function copyToClipboard() {
    const text = labelType === "iconClassname" ? iconCode : iconUnicode;
    navigator.clipboard.writeText(text).then(() => {
      vscode.postMessage({
        command: "onInfo",
        content: { message: "The icon code has been copied..." },
      });
    });
  }
</script>

<div
  role="button"
  tabindex="0"
  class="listItem"
  title={`${iconLabel} - ${iconStyle}/${iconStylePrefix}`}
  onclick={copyToClipboard}
  onkeydown={(e) => e.key === "Enter" && copyToClipboard()}
>
  <span class="inner">
    <div class="icon-container">
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
  </span>
</div>

<style>
  .listItem {
    width: 100%;
    margin-bottom: 5px;
  }

  .listItem .inner:hover {
    background-color: var(--vscode-textSeparator-foreground);
  }

  .listItem .inner {
    width: 100%;
    height: 14vw;
    background-color: var(--vscode-input-background);
    box-shadow: 0px 0px 12px rgb(0 0 0 / 6%);
    transition: all 0.3s ease-in-out;
    display: flex;
  }

  .listItem .inner .name-container {
    margin: 0px 5px 0px 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: auto;
    margin-bottom: auto;
  }

  .listItem .inner i {
    font-size: 10vw;
  }

  .listItem .inner svg {
    height: 10vw;
    width: auto;
    max-width: 100%;
  }

  .listItem .inner code {
    font-size: 4vw;
    white-space: nowrap;
    max-width: 100%;
    padding: 2px;
    border-radius: 3px;
    background-color: var(--vscode-editor-background);
  }

  .listItem .icon-container {
    width: 16.6667%;
    margin-left: 0.5rem;
    margin-top: auto;
    margin-bottom: auto;
    text-align: center;
    flex-shrink: 0;
  }

  .listItem .name-container {
    width: 83.3333%;
  }
</style>
