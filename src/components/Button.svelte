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
        background-color: var(--theme-primarybutton);

        color: var(--theme-primarytext);

        &:hover {
            border-color: var(--theme-tertiary);
            background-color: var(--theme-tertiary);
        }
    }
    .secondary {
        padding: .3em .6em;
   
        border: 2px solid var(--theme-border);
        background-color: transparent;

        color: var(--theme-secondary);

        &:hover {
            border-color: var(--theme-tertiary);
            background-color: var(--theme-tertiary);
            color: white;
        }
    }
    .tertiary {
        padding: .3em .6em;
        width: 175px;

        border: 5px solid var(--theme-primary);
        background-color: transparent;
        color: var(--theme-primary);
        
        font-weight: bold;
        font-size: 1.2em;

        transition: all 250ms ease-in;

        &:hover {
            border-color: var(--theme-primary);
            background-color: var(--theme-primary);
            color: white;

            transition: all 250ms ease-in;
        }
    }
</style>