<script>
   import Clipboard from "svelte-clipboard";
import { IconStyle } from "../services";
   export let iconCode;
   export let iconLabel;
   export let iconStyle;
   export let iconStylePrefix;
</script>

<style>
   .icon{
       display: inline-block;
       margin-bottom: 5px;
       width: 32%;
   }

   .icon .inner:hover {
       background-color: var(--vscode-textSeparator-foreground);
   }

   .icon .inner {
       display: inline-block;
       text-align: center;
       width: 100%;
       background-color: var(--vscode-input-background);
       box-shadow: 0px 0px 12px rgb(0 0 0 / 6%);
       transition: all .3s ease-in-out;
       padding-bottom: 10px;
   }

   .icon .inner .name-container {
       margin: 0px 5px 0px 5px;
       overflow: scroll;
   }

   .icon .inner .name-container::-webkit-scrollbar {
     display: none;
   }

   .icon .inner i {
       font-size: 15vw;
       padding: 10px 10px 2px 10px;
   }

   .icon .inner code {
       font-size: 3vw;
       white-space: nowrap;
       max-width: 100%;
       padding: 2px;
       border-radius: 3px;
       background-color: var(--vscode-editor-background);
   }

</style>

<Clipboard
  text={iconCode}
  let:copy
  on:copy={() => {
    tsvscode.postMessage({
        command: 'onInfo',
        content: {
            message: 'The icon code has been copied...'
        }
    })
  }}
>
  <div class="icon" title={`${iconLabel} - ${iconStyle}/${iconStylePrefix}`} on:click={copy}>
    <span class="inner">
      <i class={iconCode}></i>
      <div class="text-center name-container">
          <code>{iconCode}</code>
      </div>
    </span>
  </div>
</Clipboard>
