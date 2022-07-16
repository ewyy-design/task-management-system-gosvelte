<script>
  import {Link} from "svelte-navigator"
</script>

<div class="flex flex-col w-full">
  <div class="flex justify-between">
    <div class="text-sm breadcrumbs m-7">
      <ul>
        <li>
          <Link to="/home" style="color:black">Home</Link>
        </li>
        <li>
          <Link to="/profile" style="color:black">Profile</Link>
        </li>
        <li>Update Email</li>
      </ul>
    </div>
  </div>
  <div class="grid flex-grow card bg-base-300 rounded-box place-items-center m-10 p-10 text-center">
    <div class="w-full max-w-lg ml-20 place-self-center">
      <div class="mb-4">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input class="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" name="email" />
      </div>
      <button type="button" class="btn btn-primary">
        Update Email
      </button>
    </div>
  </div>
</div>