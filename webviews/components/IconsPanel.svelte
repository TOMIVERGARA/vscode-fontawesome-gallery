<script lang="ts">
  import Icon from "./Icon.svelte";
  import ListIcon from "./List.svelte";
  import IconList from "../services/list.ts";
  import type IconModel from "../services/icon";

  interface Props {
    panelCategory?: string;
    searchTerm: string;
    gridType?: string;
    labelType?: string;
    faVersion: string;
  }

  let {
    panelCategory = "all",
    searchTerm,
    gridType = "grid",
    labelType = "iconClassname",
    faVersion,
  }: Props = $props();

  let iconListObj = $state<IconList | null>(null);
  let iconList = $state<IconModel[]>([]);
  let totalEntries = $state(0);

  $effect(() => {
    const obj = new IconList(faVersion);
    iconListObj = obj;
    totalEntries = obj.getTotal();
    if (searchTerm) {
      iconList = obj.filterIcons(searchTerm);
    } else {
      iconList = obj.generateList(panelCategory);
    }
  });
</script>

<div role="group">
  <span role="contentinfo">
    <small>Showing <b>{iconList.length}</b> of {totalEntries} — {faVersion}</small>
  </span><br />
  <div class="icons-grid">
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
      onclick={() => {
        if (iconListObj) iconList = iconListObj.loadMoreIcons();
      }}
      class="load-more">Load more...</button
    >
  {/if}
</div>

<style>
  .icons-grid {
    margin-top: 0.5rem;
  }

  .load-more {
    margin-top: 1rem;
  }
</style>
