<script lang="ts">
  interface Props {
    x: number;
    y: number;
    iconLabel: string;
    iconCode: string;
    iconUnicode: string;
    iconStyles: string[];
  }

  let { x, y, iconLabel, iconCode, iconUnicode, iconStyles }: Props = $props();
</script>

<div class="tooltip" style="left: {x}px; top: {y}px;">
  <div class="tooltip-name">{iconLabel}</div>
  <div class="tooltip-row mono">{iconCode}</div>
  <div class="tooltip-row">U+{iconUnicode.toUpperCase()}</div>
  {#if iconStyles.length > 1}
    <div class="tooltip-row tooltip-styles">{iconStyles.join(' · ')}</div>
  {/if}
</div>

<style>
  .tooltip {
    position: fixed;
    z-index: 200;
    background: var(--vscode-editorHoverWidget-background, var(--vscode-input-background));
    border: 1px solid var(--vscode-editorHoverWidget-border, var(--vscode-input-border));
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    padding: 6px 8px;
    border-radius: 3px;
    pointer-events: none;
    min-width: 130px;
    max-width: 220px;
    color: var(--vscode-editorHoverWidget-foreground, var(--vscode-foreground));
  }

  .tooltip-name {
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .tooltip-row {
    font-size: 10px;
    color: var(--vscode-descriptionForeground);
    margin-top: 2px;
  }

  .tooltip-row.mono {
    font-family: var(--vscode-editor-font-family, monospace);
    font-style: italic;
  }

  .tooltip-styles {
    text-transform: capitalize;
  }
</style>
