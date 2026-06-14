<script lang="ts">
  import Icon from "./Icon.svelte";
  import ListIcon from "./List.svelte";
  import IconList from "../services/list.ts";
  import type IconModel from "../services/icon";
  import { vscode } from "../services/index";

  interface Props {
    panelCategory?: string;
    searchTerm: string;
    gridType?: string;
    labelType?: string;
    clickBehavior?: string;
    copyContent?: string;
    faVersion: string;
    iconSize?: number;
    favorites?: string[];
    recents?: string[];
  }

  let {
    panelCategory = "all",
    searchTerm,
    gridType = "grid",
    labelType = "iconClassname",
    clickBehavior = "copy",
    copyContent = "classname",
    faVersion,
    iconSize = 1,
    favorites = [],
    recents = [],
  }: Props = $props();

  let iconListObj = $state<IconList | null>(null);
  let iconList = $state<IconModel[]>([]);
  let totalEntries = $state(0);
  let sentinel = $state<HTMLElement | null>(null);
  let gridEl = $state<HTMLElement | null>(null);

  $effect(() => {
    const obj = new IconList(faVersion);
    iconListObj = obj;
    totalEntries = obj.getTotal();

    if (panelCategory === "favorites") {
      iconList = favorites.map((k) => obj.getIconByKey(k)).filter(Boolean) as IconModel[];
    } else if (panelCategory === "recents") {
      iconList = recents.map((k) => obj.getIconByKey(k)).filter(Boolean) as IconModel[];
    } else if (panelCategory === "new") {
      iconList = obj.getNewIcons();
    } else if (searchTerm) {
      iconList = obj.filterIcons(searchTerm);
    } else {
      iconList = obj.generateList(panelCategory);
    }
  });

  // Infinite scroll via IntersectionObserver
  $effect(() => {
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && panelCategory === "all" && !searchTerm) {
          iconList = iconListObj?.loadMoreIcons() ?? iconList;
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  });

  // Arrow key navigation across the icon grid
  function handleGridKeydown(e: KeyboardEvent) {
    if (!gridEl) return;
    const icons = Array.from(gridEl.querySelectorAll('[role="button"]')) as HTMLElement[];
    const focused = document.activeElement as HTMLElement;
    const idx = icons.indexOf(focused);
    if (idx === -1) return;

    const firstIcon = icons[0];
    const cols = firstIcon ? Math.round(gridEl.clientWidth / firstIcon.offsetWidth) : 1;
    const delta: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: cols,
      ArrowUp: -cols,
    };
    const d = delta[e.key];
    if (d === undefined) return;
    e.preventDefault();
    const next = icons[Math.max(0, Math.min(icons.length - 1, idx + d))];
    next?.focus();
  }

  function iconKey(icon: IconModel): string {
    return `${icon.name}:${icon.styleName}`;
  }

  function toggleFavorite(icon: IconModel) {
    vscode.postMessage({ command: "toggle-favorite", content: { key: iconKey(icon) } });
  }

  function logRecent(icon: IconModel) {
    vscode.postMessage({ command: "log-recent", content: { key: iconKey(icon) } });
  }
</script>

<div role="group">
  <span role="contentinfo">
    <small>Showing <b>{iconList.length}</b> of {totalEntries} — {faVersion}</small>
  </span><br />
  <div
    class="icons-grid"
    role="grid"
    tabindex="-1"
    bind:this={gridEl}
    onkeydown={handleGridKeydown}
  >
    {#each iconList as icon (icon.iconCode + icon.styleName)}
      {@const key = iconKey(icon)}
      {#if gridType == "grid"}
        <Icon
          {labelType}
          {clickBehavior}
          {copyContent}
          {faVersion}
          {iconSize}
          iconCode={faVersion == "v5" ? icon.iconCode : icon.iconCodeV6}
          iconUnicode={icon.unicode}
          iconLabel={icon.label}
          iconStyle={icon.styleName}
          iconStylePrefix={icon.style}
          iconStyles={icon.allStyles}
          svgPath={icon.svgPath ?? ""}
          svgWidth={icon.svgWidth ?? 512}
          svgHeight={icon.svgHeight ?? 512}
          addedIn={icon.addedIn}
          isFavorite={favorites.includes(key)}
          onToggleFavorite={() => toggleFavorite(icon)}
          onLogRecent={() => logRecent(icon)}
        />
      {:else}
        <ListIcon
          {labelType}
          {clickBehavior}
          {copyContent}
          {faVersion}
          {iconSize}
          iconCode={faVersion == "v5" ? icon.iconCode : icon.iconCodeV6}
          iconUnicode={icon.unicode}
          iconLabel={icon.label}
          iconStyle={icon.styleName}
          iconStylePrefix={icon.style}
          iconStyles={icon.allStyles}
          svgPath={icon.svgPath ?? ""}
          svgWidth={icon.svgWidth ?? 512}
          svgHeight={icon.svgHeight ?? 512}
          addedIn={icon.addedIn}
          isFavorite={favorites.includes(key)}
          onToggleFavorite={() => toggleFavorite(icon)}
          onLogRecent={() => logRecent(icon)}
        />
      {/if}
    {/each}
  </div>
  {#if panelCategory === "all" && !searchTerm}
    <div bind:this={sentinel} class="scroll-sentinel" aria-hidden="true"></div>
  {/if}
</div>

<style>
  .icons-grid {
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
  }

  .scroll-sentinel {
    height: 1px;
    width: 100%;
  }
</style>
