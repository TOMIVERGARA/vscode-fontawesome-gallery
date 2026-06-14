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
  };

  let behaviorLabel = $derived(clickBehaviorLabel[clickBehavior] ?? clickBehavior);
  let contentLabel = $derived(copyContentLabel[copyContent] ?? copyContent);

  // Persist session state and notify extension to update globalState
  $effect(() => {
    vscode.setState({ gridType, faVersion, labelType, clickBehavior, copyContent });
    vscode.postMessage({
      command: "state-update",
      content: { gridType, faVersion, labelType, clickBehavior, copyContent },
    });
  });

  // Notify extension that webview is ready to receive initial state
  $effect(() => {
    vscode.postMessage({ command: "ready" });
  });

  function toggleGridType() {
    gridType = gridType === "grid" ? "list" : "grid";
  }

  function setLabelType(type: string) {
    labelType = type;
  }

  function setFaVersion(version: string) {
    faVersion = version;
  }

  function setClickBehavior(behavior: string) {
    clickBehavior = behavior;
  }

  function setCopyContent(content: string) {
    copyContent = content;
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
        break;
      case "setLabelType":
        setLabelType(message.data);
        break;
      case "toggleGridType":
        toggleGridType();
        break;
      case "setFaVersion":
        setFaVersion(message.data);
        break;
      case "setClickBehavior":
        setClickBehavior(message.data);
        break;
      case "setCopyContent":
        setCopyContent(message.data);
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
      <optgroup label="Categories">
        {#each categoryList as category}
          <option value={category.name}>{category.label}</option>
        {/each}
      </optgroup>
    </select>
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
  <IconsPanel
    panelCategory={categorySelector}
    {gridType}
    {labelType}
    {clickBehavior}
    {copyContent}
    {searchTerm}
    {faVersion}
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
</style>
