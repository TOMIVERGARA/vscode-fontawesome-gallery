<script>
    import Icon from './Icon.svelte';
    import IconList from '../services/list.ts';

    //Props
    export let panelCategory = 'all';

    //Fetch first ~100 icons.
    $: list = new IconList().generateList(panelCategory);

</script>

<div>
    {#each list as icon}
        <Icon iconCode={icon.iconCode} iconName={icon.iconName} iconLabel={icon.label} iconStyle={icon.styleName} iconStylePrefix={icon.style}/>
    {/each}
</div>