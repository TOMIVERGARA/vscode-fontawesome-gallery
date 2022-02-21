<script>
  import IconsPanel from "./IconsPanel.svelte";
  import { getIconCategories } from "../services/common";
  import { vscode } from "../services/index";
  import { onMount } from "svelte";

  //Input Values
  let searchTerm = "";
  let categorySelector = "all";
  let gridType = vscode.getState()?.gridType || "grid";
  let labelType = "iconClassname";
  let faVersion = vscode.getState()?.faVersion || "v6";
  let categoryList = getIconCategories(faVersion);

  $: {
    vscode.setState({ gridType, faVersion });

    //Fetch Categories
    categoryList = getIconCategories(faVersion);
  }

  function toggleGridType() {
    gridType = gridType == "grid" ? (gridType = "list") : (gridType = "grid");
  }

  function setLabelType(type) {
    labelType = type;
  }

  function setFaVersion(version) {
    faVersion = version;
  }

  function messageManager(event) {
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
      default:
        break;
    }
  }

  onMount(async () => {
    window.addEventListener("message", (event) => {
      messageManager(event);
    });
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
      role="option"
      class="mb2"
      on:focus={() => (searchTerm = "")}
      bind:value={categorySelector}
    >
      <option value="all" selected>All</option>
      <optgroup label="Categories">
        {#each categoryList as category}
          <option value={category.name}>{category.label}</option>
        {/each}
      </optgroup>
    </select>
    <button class="menu-button mb2" on:click={toggleGridType}>
      {#if gridType == "list"}
        <i class="fas fa-th-large" />
      {:else}
        <i class="fas fa-bars" />
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
    text-indent: 1px;
    text-overflow: "";
  }

  .menu-group {
    display: flex;
  }

  .menu-group .menu-button {
    width: 33px;
    margin-left: 4px;
  }
</style>
