<script lang="ts">
  import IconsPanel from "./IconsPanel.svelte";
  import { getIconCategories } from "../services/common";
  import { vscode } from "../services/index";

  let searchTerm = $state("");
  let categorySelector = $state("all");
  let gridType = $state<string>(vscode.getState()?.gridType || "grid");
  let labelType = $state("iconClassname");
  let faVersion = $state<string>(vscode.getState()?.faVersion || "v6");

  let categoryList = $derived(getIconCategories(faVersion));

  $effect(() => {
    vscode.setState({ gridType, faVersion });
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

  function messageManager(event: MessageEvent) {
    const message = event.data;
    switch (message.command) {
      case "setLabelType":
        setLabelType(message.data);
        break;
      case "toggleGridType":
        toggleGridType();
        break;
      case "setFaVersion":
        setFaVersion(message.data);
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
  <IconsPanel
    panelCategory={categorySelector}
    {gridType}
    {labelType}
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
</style>
