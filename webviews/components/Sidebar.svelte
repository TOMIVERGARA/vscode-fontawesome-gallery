<script lang="ts">
    import IconsPanel from './IconsPanel.svelte';
    import { getIconCategories } from '../services/common';

    //Fetch Categories
    let categoryList = getIconCategories();

    //Input Values
    let searchTerm: string = '';
    let categorySelector: string = 'all';
</script>

<style>
    select {
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 1px;
        text-overflow: '';
    }
</style>

<div>
    <form>
       <input placeholder="Search icon..." bind:value={searchTerm} type="text">
    </form>
    <select class="mb2" bind:value={categorySelector}>
        <option value="all" selected>All</option>
        <optgroup label="Categories">
            {#each categoryList as category}
                <option value={category.name}>{category.label}</option>
            {/each}
        </optgroup>
    </select>
    <IconsPanel panelCategory={categorySelector} searchTerm={searchTerm}/>
    {#if categorySelector == 'all'}
       {#if !searchTerm}
          <button class="mt2">Load more...</button>
       {/if}
    {/if}
</div>