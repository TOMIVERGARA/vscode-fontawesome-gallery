<script>
    import Icon from './Icon.svelte';
    import IconList from '../services/list.ts';

    //Props
    export let panelCategory = 'all';
    export let searchTerm;

    //Fetch first ~100 icons.
    let List = new IconList();
    $: list = List.generateList(panelCategory);
    $: if(searchTerm){
        list = List.filterIcons(searchTerm);
    }else{
        list = List.generateList(panelCategory);
    }

    let totalEntries = List.getTotal();
</script>

<div role="group">
    <span role="contentinfo"><small>Showing <b>{list.length}</b> of {totalEntries}</small></span><br>
    <div class="mt1">
      {#each list as icon}
          <Icon iconCode={icon.iconCode} iconName={icon.iconName} iconLabel={icon.label} iconStyle={icon.styleName} iconStylePrefix={icon.style}/>
      {/each}
    </div>
    {#if panelCategory == 'all'}
       {#if !searchTerm}
          <button on:click={() => {
              list = List.loadMoreIcons();
          }} class="mt2">Load more...</button>
       {/if}
    {/if}
</div>