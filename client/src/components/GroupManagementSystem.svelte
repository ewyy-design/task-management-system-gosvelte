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
      <li>Add New Group</li>
    </ul>
  </div>

  <form class="w-full max-w-lg ml-20 place-self-center text-center">
    <div class="text-2xl font-bold mb-5 ">Create New Group</div>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-username">
          User Group
        </label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" require />
      </div>
    </div>
    <button class="btn btn-primary place-items-center" type="submit">
      Create Group
    </button>

  </form>
  <hr class="m-10" />

  <div class="relative m-5">
    <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
      <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>
    <input type="search" class="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Groups..."  />
    <button type="button" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >
      Search
    </button>
  </div>
  <div class="w-full max-w-lg ml-20 place-self-center">
  </div>
  <div class="overflow-x-auto m-5">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>User Group (s)</th>
          <th>Status</th>
          <th>Action (s)</th>
        </tr>
      </thead>
    </table>
  </div>
</div>