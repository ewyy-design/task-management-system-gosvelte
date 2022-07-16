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
        <li>Update Password</li>
      </ul>
    </div>
  </div>
  <form>
    <div class="grid flex-grow card bg-base-300 rounded-box place-items-center m-10 p-10">
      {" "}
      <div class="content-center text-center">
        <div class="mb-4">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="block text-gray-700 text-sm font-bold mb-2">Old Password</label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" name="oldpassword" required />
        </div>
        <div class="mb-6">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="block text-gray-700 text-sm font-bold mb-2">New Password</label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" name="newpassword" required />
        </div>
        <button type="submit" class="btn btn-primary" >
          Update Password
        </button>
      </div>
    </div>
  </form>
</div>