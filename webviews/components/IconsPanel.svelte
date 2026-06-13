<script>
  import Icon from "./Icon.svelte";
  import ListIcon from "./List.svelte";
  import IconList from "../services/list.ts";

  export let panelCategory = "all";
  export let searchTerm;
  export let gridType = "grid";
  export let labelType = "iconClassname";
  export let faVersion;

  let IconListObj = new IconList(faVersion);
  let iconList = IconListObj.generateList(panelCategory);
  let totalEntries = IconListObj.getTotal();

  $: {
    IconListObj = new IconList(faVersion);
    totalEntries = IconListObj.getTotal();

    if (searchTerm) {
      iconList = IconListObj.filterIcons(searchTerm);
    } else {
      iconList = IconListObj.generateList(panelCategory);
    }
  }
</script>

<div role="group">
  <span role="contentinfo">
    <small>Showing <b>{iconList.length}</b> of {totalEntries} — {faVersion}</small>
  </span><br />
  <div class="mt1">
    {#each iconList as icon}
      {#if gridType == "grid"}
        <Icon
          {labelType}
          {faVersion}
          iconCode={faVersion == "v5" ? icon.iconCode : icon.iconCodeV6}
          iconUnicode={icon.unicode}
          iconLabel={icon.label}
          iconStyle={icon.styleName}
          iconStylePrefix={icon.style}
          svgPath={icon.svgPath ?? ""}
          svgWidth={icon.svgWidth ?? 512}
          svgHeight={icon.svgHeight ?? 512}
        />
      {:else}
        <ListIcon
          {labelType}
          {faVersion}
          iconCode={faVersion == "v5" ? icon.iconCode : icon.iconCodeV6}
          iconUnicode={icon.unicode}
          iconLabel={icon.label}
          iconStyle={icon.styleName}
          iconStylePrefix={icon.style}
          svgPath={icon.svgPath ?? ""}
          svgWidth={icon.svgWidth ?? 512}
          svgHeight={icon.svgHeight ?? 512}
        />
      {/if}
    {/each}
  </div>
  {#if panelCategory == "all" && !searchTerm}
    <button
      on:click={() => {
        iconList = IconListObj.loadMoreIcons();
      }}
      class="mt2">Load more...</button
    >
  {/if}
</div>
