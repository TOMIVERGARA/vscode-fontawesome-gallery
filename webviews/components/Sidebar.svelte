<script lang="ts">
  import IconsPanel from "./IconsPanel.svelte";
  import { getIconCategories } from "../services/common";
  import { vscode } from "../services/index";

  const savedState = vscode.getState() ?? {};
  let searchTerm = $state("");
  let categorySelector = $state("all");
  let gridType = $state<string>(savedState.gridType || "grid");
  let labelType = $state<string>(savedState.labelType || "iconClassname");
  let clickBehavior = $state<string>(savedState.clickBehavior || "copy");
  let copyContent = $state<string>(savedState.copyContent || "classname");
  let faVersion = $state<string>(savedState.faVersion || "v6");
  let iconSize = $state<number>(savedState.iconSize ?? 1);
  let favorites = $state<string[]>([]);
  let recents = $state<string[]>([]);

  let categoryList = $derived(getIconCategories(faVersion));

  const clickBehaviorLabel: Record<string, string> = {
    copy: "Copy",
    insert: "Insert",
  };
  const copyContentLabel: Record<string, string> = {
    classname: "Classname",
    html: "HTML Tag",
    unicode: "Unicode",
    vue: "Vue Array",
    react: "React JSX",
    svg: "SVG",
  };

  let behaviorLabel = $derived(clickBehaviorLabel[clickBehavior] ?? clickBehavior);
  let contentLabel = $derived(copyContentLabel[copyContent] ?? copyContent);

  // Persist session state and notify extension to update globalState
  $effect(() => {
    vscode.setState({ gridType, faVersion, labelType, clickBehavior, copyContent, iconSize });
    vscode.postMessage({
      command: "state-update",
      content: { gridType, faVersion, labelType, clickBehavior, copyContent, iconSize },
    });
  });

  // Notify extension that webview is ready to receive initial state
  $effect(() => {
    vscode.postMessage({ command: "ready" });
  });

  function toggleGridType() {
    gridType = gridType === "grid" ? "list" : "grid";
  }

  function messageManager(event: MessageEvent) {
    const message = event.data;
    switch (message.command) {
      case "setInitialState":
        gridType = message.data.gridType ?? gridType;
        faVersion = message.data.faVersion ?? faVersion;
        labelType = message.data.labelType ?? labelType;
        clickBehavior = message.data.clickBehavior ?? clickBehavior;
        copyContent = message.data.copyContent ?? copyContent;
        iconSize = message.data.iconSize ?? iconSize;
        favorites = message.data.favorites ?? [];
        recents = message.data.recents ?? [];
        break;
      case "setLabelType":
        labelType = message.data;
        break;
      case "toggleGridType":
        toggleGridType();
        break;
      case "setFaVersion":
        faVersion = message.data;
        break;
      case "setClickBehavior":
        clickBehavior = message.data;
        break;
      case "setCopyContent":
        copyContent = message.data;
        break;
      case "favoritesUpdated":
        favorites = message.data ?? [];
        break;
      case "recentsUpdated":
        recents = message.data ?? [];
        break;
    }
  }

  $effect(() => {
    window.addEventListener("message", messageManager);
    return () => window.removeEventListener("message", messageManager);
  });
</script>

<div>
  <form>
    <input
      role="searchbox"
      placeholder="Search icon..."
      bind:value={searchTerm}
      type="text"
    />
  </form>
  <div class="menu-group">
    <select
      class="category-select"
      onfocus={() => (searchTerm = "")}
      bind:value={categorySelector}
    >
      <option value="all" selected>All</option>
      {#if favorites.length > 0}
        <option value="favorites">Favorites ({favorites.length})</option>
      {/if}
      {#if recents.length > 0}
        <option value="recents">Recent ({recents.length})</option>
      {/if}
      <optgroup label="Categories">
        {#each categoryList as category}
          <option value={category.name}>{category.label}</option>
        {/each}
      </optgroup>
    </select>
    <button
      class="menu-button"
      title="Smaller icons"
      onclick={() => { iconSize = Math.max(0.6, parseFloat((iconSize - 0.2).toFixed(1))); }}
    >A-</button>
    <button
      class="menu-button"
      title="Larger icons"
      onclick={() => { iconSize = Math.min(2, parseFloat((iconSize + 0.2).toFixed(1))); }}
    >A+</button>
    <button class="menu-button" onclick={toggleGridType}>
      {#if gridType == "list"}
        <i class="fas fa-th-large"></i>
      {:else}
        <i class="fas fa-bars"></i>
      {/if}
    </button>
  </div>
  <div class="click-mode">
    <span class="mode-label">Mode:</span>
    <span class="chip">{behaviorLabel}</span>
    <span class="chip">{contentLabel}</span>
  </div>
  {#if faVersion === "v5"}
    <div class="deprecation-banner">
      ⚠ Font Awesome 5 is no longer maintained. Consider upgrading to v6 or v7.
    </div>
  {/if}
  <IconsPanel
    panelCategory={categorySelector}
    {gridType}
    {labelType}
    {clickBehavior}
    {copyContent}
    {searchTerm}
    {faVersion}
    {iconSize}
    {favorites}
    {recents}
  />
</div>

<style>
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    text-indent: 1px;
    text-overflow: "";
  }

  .category-select {
    margin-bottom: 1rem;
  }

  .menu-group {
    display: flex;
  }

  .menu-group .menu-button {
    width: 33px;
    margin-left: 4px;
    margin-bottom: 1rem;
  }

  .click-mode {
    display: flex;
    gap: 4px;
    margin-bottom: 0.5rem;
  }

  .mode-label {
    font-size: 10px;
    color: var(--vscode-descriptionForeground);
    align-self: center;
  }

  .chip {
    font-size: 10px;
    padding: 1px 6px;
    background: var(--vscode-badge-background);
    color: var(--vscode-badge-foreground);
    opacity: 0.75;
  }

  .deprecation-banner {
    font-size: 11px;
    padding: 6px 8px;
    background: var(--vscode-inputValidation-warningBackground, #4d3800);
    color: var(--vscode-inputValidation-warningForeground, #cca700);
    border: 1px solid var(--vscode-inputValidation-warningBorder, #b89500);
    border-radius: 2px;
    margin-bottom: 8px;
  }
</style>
