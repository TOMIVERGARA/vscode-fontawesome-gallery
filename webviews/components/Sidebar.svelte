<script>
    import IconsPanel from './IconsPanel.svelte';
    import { getIconCategories } from '../services/common';
    import { vscode } from '../services/index';

    //Fetch Categories
    let categoryList = getIconCategories();

    //Input Values
    let searchTerm = '';
    let categorySelector = 'all';
    let gridType = vscode.getState().gridType || 'grid';

    $: {
        vscode.setState({ gridType });
    }

    function toggleGridType(){
        gridType = gridType == 'grid' ? gridType = 'list' : gridType = 'grid';
    }
</script>

<style>
    select {
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 1px;
        text-overflow: '';
    }

    .menu-group{
        display: flex;
    }

    .menu-group .menu-button{
        width: 33px;
        margin-left: 4px;
    }
</style>

<div>
    <form>
       <input role="searchbox" placeholder="Search icon..." bind:value={searchTerm} type="text">
    </form>
    <div class="menu-group">
      <select role="option" class="mb2" on:focus={() => searchTerm = ''} bind:value={categorySelector}>
          <option value="all" selected>All</option>
          <optgroup label="Categories">
              {#each categoryList as category}
                  <option value={category.name}>{category.label}</option>
              {/each}
          </optgroup>
      </select>
      <button class="menu-button mb2" on:click={toggleGridType}>
        {#if gridType == 'list'}
            <i class="fas fa-th-large"></i>
        {:else}
            <i class="fas fa-bars"></i>
        {/if}
      </button>
    </div>
    <IconsPanel gridType={gridType} panelCategory={categorySelector} searchTerm={searchTerm}/>
</div>