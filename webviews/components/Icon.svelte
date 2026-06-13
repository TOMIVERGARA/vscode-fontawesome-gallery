<script>
  import { vscode } from "../services/index";
  export let labelType = "iconClassname";
  export let iconCode;
  export let iconUnicode;
  export let iconLabel;
  export let iconStyle;
  export let iconStylePrefix;
  export let faVersion = "v6";
  export let svgPath = "";
  export let svgWidth = 512;
  export let svgHeight = 512;

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
  class="icon"
  title={`${iconLabel} - ${iconStyle}/${iconStylePrefix}`}
  on:click={copyToClipboard}
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
      <i class={iconCode} />
    {/if}
    <div class="text-center name-container">
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
    margin-bottom: 5px;
    width: 32%;
  }

  @media only screen and (max-width: 250px) {
    .icon {
      width: 49% !important;
    }
  }

  @media only screen and (max-width: 215px) {
    .icon {
      width: 99% !important;
    }

    .icon .inner {
      height: 100% !important;
    }

    .icon .inner i,
    .icon .inner svg {
      font-size: 20vw !important;
      height: 20vw !important;
      padding: 10px 10px 3% 10px !important;
    }

    .icon .inner code {
      font-size: 4vw !important;
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
