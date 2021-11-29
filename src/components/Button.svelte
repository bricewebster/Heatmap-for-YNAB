<script>
    export let type = 'primary';
    $$restProps //Used to include all the props when the component is used. That way the button can be clicked, focused, etc.
</script>

<button class={type} on:click on:mouseover on:focus on:mouseenter on:mouseleave	{...$$restProps}>
    <slot></slot>
</button>

<style lang="scss">
    button {
        padding: .3em .6em;

        border-radius: .4em;

        line-height: 1em;

        cursor: pointer;
    }
    .primary {
        border: 2px solid transparent;
        background-color: var(--heatmap-primary);

        color: white;

        &:hover {
            border-color: var(--heatmap-tertiary);
            background-color: var(--heatmap-tertiary);
        }
    }
    .secondary {
        padding: .3em .6em;
   
        border: 2px solid #dee3e8;
        background-color: transparent;

        color: var(--heatmap-primary);

        &:hover {
            border-color: var(--heatmap-tertiary);
            background-color: var(--heatmap-tertiary);
            color: white;
        }
    }
</style>

<!-- markup (zero or more items) goes here -->