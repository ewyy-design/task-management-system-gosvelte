<script>
  // import cart from "./store";

  /*  import {Link} from "svelte-navigator" */
  import { fetchData } from "./store";

  // import cartItems from "./store";

  // cartItems.subscribe((items) => {
  //   console.log(items);
  // });

  fetchData();
</script>

<div class="mb-5 mt-20">
  <div class="text-2xl font-bold mb-5 text-center ">All Applications</div>
</div>
