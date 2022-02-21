<script>
  import Icon from "./Icon.svelte";
  import ListIcon from "./List.svelte";
  import IconList from "../services/list.ts";

  //Props
  export let panelCategory = "all";
  export let searchTerm;
  export let gridType = "grid";
  export let labelType = "iconClassname";
  export let faVersion;

  //Fetch first ~100 icons.
  let IconListObj = new IconList(faVersion);
  let iconList = IconListObj.generateList(panelCategory);
  let totalEntries = IconListObj.getTotal();
  $: {
    IconListObj = new IconList(faVersion);
    totalEntries = IconListObj.getTotal();
    iconList = IconListObj.generateList(panelCategory);

    if (searchTerm) {
      iconList = IconListObj.filterIcons(searchTerm);
    } else {
      iconList = IconListObj.generateList(panelCategory);
    }
  }
</script>

<div role="group">
  <span role="contentinfo"
    ><small
      >Showing <b>{iconList.length}</b> of {totalEntries} - {faVersion}</small
    ></span
  ><br />
  <div class="mt1">
    {#each iconList as icon}
      {#if gridType == "grid"}
        <Icon
          {labelType}
          iconCode={icon.iconCode}
          iconUnicode={icon.unicode}
          iconLabel={icon.label}
          iconStyle={icon.styleName}
          iconStylePrefix={icon.style}
        />
      {:else}
        <ListIcon
          {labelType}
          iconCode={icon.iconCode}
          iconUnicode={icon.unicode}
          iconLabel={icon.label}
          iconStyle={icon.styleName}
          iconStylePrefix={icon.style}
        />
      {/if}
    {/each}
  </div>
  {#if panelCategory == "all"}
    {#if !searchTerm}
      <button
        on:click={() => {
          iconList = IconListObj.loadMoreIcons();
        }}
        class="mt2">Load more...</button
      >
    {/if}
  {/if}
</div>
