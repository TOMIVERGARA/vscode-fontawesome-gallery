<script lang="ts">
  export interface MenuAction {
    label: string;
    action: () => void;
  }

  interface Props {
    x: number;
    y: number;
    actions: MenuAction[];
    onclose: () => void;
  }

  let { x, y, actions, onclose }: Props = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") onclose();
  }

  function handleAction(fn: () => void) {
    fn();
    onclose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="overlay" role="presentation" onclick={onclose}></div>

<ul class="menu" style="left: {x}px; top: {y}px;" role="menu">
  {#each actions as item}
    <li role="menuitem">
      <button onclick={() => handleAction(item.action)}>{item.label}</button>
    </li>
  {/each}
</ul>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 99;
  }

  .menu {
    position: fixed;
    z-index: 100;
    background: var(--vscode-menu-background, var(--vscode-input-background));
    border: 1px solid var(--vscode-menu-separatorBackground, var(--vscode-input-border));
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    min-width: 180px;
    padding: 4px 0;
    list-style: none;
    margin: 0;
    border-radius: 2px;
  }

  .menu li button {
    display: block;
    width: 100%;
    padding: 6px 12px;
    text-align: left;
    background: none;
    border: none;
    color: var(--vscode-menu-foreground, var(--vscode-foreground));
    cursor: pointer;
    font-size: 12px;
    white-space: nowrap;
  }

  .menu li button:hover {
    background: var(--vscode-menu-selectionBackground, var(--vscode-list-activeSelectionBackground));
    color: var(--vscode-menu-selectionForeground, var(--vscode-list-activeSelectionForeground));
  }
</style>
