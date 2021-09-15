<script>
    export let selectedFilter;
</script>

<div class="backdrop">
    <div class="popup {selectedFilter}">
        <p class="title">{selectedFilter}</p>
        <div class="selection">
            <ul>
                <li>Select All</li>
                <li>Select None</li>
            </ul>
        </div>
        <div class="list">
            
        </div>
    </div>
</div>

<style lang="scss">
    .popup {
        position: absolute;
        right: 200px;

        margin-top: 30px;

        width:  250px;
        height: 350px;

        border-radius: 5px;
        box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2);

        opacity: 1;
    }
    .title {
        margin: 15px 0 5px 15px;

        font-size: 1em;
        font-weight: 700;
        color: #383e41;
    }

    .selection {
        margin: 5px 15px 0 15px;
        height: 35px;

        border-top: 1px solid rgba(0, 0, 0, 0.15);
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);

        & li {
        display: inline-block;
        margin: 5px 5px 0 10px;
        background: none;

        font-size: 13.5px;
        color: var(--ynab-light-blue);

        &:hover {
            color: var(--ynab-dark-green);

            cursor: pointer;
        }
        }
    }
  
    .list {
        margin: 15px 0 0 15px;
        width: 220px;
        height: 200px;

        font-size: .9rem;

        overflow-y: scroll;
    }

  .select-buttons {
    float: right;

    margin: 15px 10px 0 0;
    width: 140px;

    & button {
      padding: .3em .6em;

      border-radius: .4em;

      line-height: 1em;
    }

    & button.cancel {
      padding: .3em .6em;
   
      border: 2px solid #dee3e8;
      background-color: transparent;

     // color: $ynab-light-green;

      &:hover {
          border-color: var(--ynab-teal);
          background-color: var(--ynab-teal);
          color: white;
      }
    }

    & button.done {
      border: 2px solid transparent;
      background-color: var(--ynab-light-green);

      color: white;

      &:hover {
        border-color: var(--ynab-teal);
        background-color: var(--ynab-teal);
      }
    }
    }

 .Categories {
   top: 95px;
   right: 455px;
 }
 .Accounts {
    top: 95px;
   right: 275px;
 }
 .Sources {
    top: 95px;
   right: 105px;
 }
.Accounts::after, .Categories::after, .Sources::after {
  content: " ";
  position: absolute;
  bottom: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 15px;
  border-style: solid;
  border-color: transparent transparent white transparent;
}
</style>