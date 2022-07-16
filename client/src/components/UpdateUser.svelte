<script>
  import {Link} from "svelte-navigator"

</script>

<div class="flex flex-col w-full">
  <div class="text-sm breadcrumbs m-7">
    <ul>
      <li>
        <Link to="/home" style="color:black">Home</Link>
      </li>
      <li>
        <Link to="/usermanagementsystem" style="color:black">User Management System</Link>
      </li>
      <li>Update User</li>
    </ul>
  </div>
    <form class="w-full max-w-lg ml-20 place-self-center">
      <div class="text-2xl font-bold mb-5 ">Update Profile: </div>

      <div class="flex flex-wrap">
        <div class="w-full px-3">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
            Email
          </label>
          <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" name="email" />
        </div>
        <div class="w-full md:w-1/3 px-3 mb-6">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-3" for="grid-state">
            User Group
          </label>
          <div class="relative">
         
          </div>
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-5" for="grid-state">
            Status
          </label>
          <div class="relative">
          
          </div>
        </div>
      </div>
      <button class="btn btn-primary place-items-center" type="button" >
        Update User
      </button>
    </form>
  <hr class="m-10" />
  <form class="w-full max-w-lg ml-20 place-self-center">
    <div class="text-2xl font-bold mb-5 ">Update Password</div>

    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3"></div>
      <div class="w-full px-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
          New Password
        </label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="password" name="password" required />
      </div>
    </div>
    <button class="btn btn-secondary place-items-center mb-10" type="button">
      Update Password
    </button>
  </form>
</div>