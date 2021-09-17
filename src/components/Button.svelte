<script>
    export let type = 'primary';
    $$restProps

</script>

<button class={type} on:click on:mouseover on:focus on:mouseenter on:mouseleave	{...$$restProps}>
    <slot></slot>
</button>

<style lang="scss">
    button {
        padding: .3em .6em;

        border-radius: .4em;

        line-height: 1em;
    }
    .primary {
        border: 2px solid transparent;
        background-color: var(--ynab-light-green);

        color: white;

        &:hover {
            border-color: var(--ynab-teal);
            background-color: var(--ynab-teal);
        }
    }
    .secondary {
        padding: .3em .6em;
   
        border: 2px solid #dee3e8;
        background-color: transparent;

        color: var(--ynab-light-green);

        &:hover {
            border-color: var(--ynab-teal);
            background-color: var(--ynab-teal);
            color: white;
        }
    }
</style>

<!-- markup (zero or more items) goes here -->