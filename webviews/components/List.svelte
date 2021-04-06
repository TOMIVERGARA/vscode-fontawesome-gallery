<script>
    import Clipboard from "svelte-clipboard";
    import { vscode } from '../services/index';
    export let iconCode;
    export let iconLabel;
    export let iconStyle;
    export let iconStylePrefix;
 </script>

<style>
    .listItem {
        width: 100%;
        margin-bottom: 5px;
    }

    .listItem .inner:hover {
        background-color: var(--vscode-textSeparator-foreground);
    }

    .listItem .inner {
        width: 100%;
        height: 14vw;
        background-color: var(--vscode-input-background);
        box-shadow: 0px 0px 12px rgb(0 0 0 / 6%);
        transition: all .3s ease-in-out;
        display: flex;
    }

    .listItem .inner .name-container {
       margin: 0px 5px 0px 5px;
       overflow: scroll;
       margin-top: auto;
       margin-bottom: auto;
   }

   .listItem .inner .name-container::-webkit-scrollbar {
     display: none;
   }

   .listItem .inner i {
       font-size: 10vw;
       /* padding: 10px 10px 2px 10px; */
   }

   .listItem .inner code {
       font-size: 4vw;
       white-space: nowrap;
       max-width: 100%;
       padding: 2px;
       border-radius: 3px;
       background-color: var(--vscode-editor-background);
   }

   .listItem .icon-container {
       margin-top: auto;
       margin-bottom: auto;
       text-align: center;
   }

</style>

<Clipboard
  text={iconCode}
  let:copy
  on:copy={() => {
    vscode.postMessage({
        command: 'onInfo',
        content: {
            message: 'The icon code has been copied...'
        }
    })
  }}
>
 <div role="button" class="listItem" title={`${iconLabel} - ${iconStyle}/${iconStylePrefix}`} on:click={copy}>
    <span class="inner">
      <div class="icon-container col col-2 ml1"><i class={iconCode}></i></div>
      <div class="name-container col col-10">
          <code>{iconCode}</code>
      </div>
    </span>
 </div>
</Clipboard>