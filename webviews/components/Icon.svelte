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
  class="icon"
  title={`${iconLabel} - ${iconStyle}/${iconStylePrefix}`}
  onclick={copyToClipboard}
  onkeydown={(e) => e.key === "Enter" && copyToClipboard()}
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
        <code>{iconCode}</code>
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
    max-width: 100%;
    padding: 2px;
    border-radius: 3px;
    background-color: var(--vscode-editor-background);
  }
</style>
