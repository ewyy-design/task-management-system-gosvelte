<script>
  import {Link} from "svelte-navigator"
</script>

<div class="flex flex-col w-full">
  <div class="text-sm breadcrumbs m-7">
    <ul>
      <li>
        <Link to="/home" style="color:black">Home</Link>
      </li>
      <li>Profile</li>
    </ul>
  </div>
  <div class="text-2xl font-bold mb-5 place-self-center ">
    <strong>'s Profile</strong>
  </div>
  <div>
    <div class="flex flex-col w-full lg:flex-row">
      <div class="grid flex-grow h-40 card bg-base-300 rounded-box m-10 pt-4 text-center">
        <div class="mb-6">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="block text-black text-sm font-bold mb-2">Email</label>
          <p></p>
        </div>
        <div class="mb-6">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="block text-black text-sm font-bold mb-2">User Group (s)</label>
          <ul></ul>
        </div>
      </div>
    </div> 
  </div>
  <div class="grid grid-cols-2 place-self-center gap-5 ">
    <div>
      <Link to="/updatepassword">
        <button type="submit" class="btn btn-primary ">
          Update Password
        </button>
      </Link>
    </div>
    <div>
      <Link to="/updateemail">
        <button type="button" class="btn btn-primary">
          Update Email
        </button>
      </Link>
    </div>
  </div>
</div>