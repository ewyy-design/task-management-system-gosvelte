<script>
  import {Link} from "svelte-navigator"
</script>

<div class="flex flex-col w-full">
  <div class="text-sm breadcrumbs m-7">
    <ul>
      <li>
        <Link to="/home" style="color:black">Home</Link>
      </li>
      <li>Create New Application</li>
    </ul>
  </div>

  <form class="w-full max-w-lg place-self-center text-center">
    <div class="text-2xl font-bold mb-5 ">Create New Application</div>

    <div class="flex flex-wrap -mx-3 mb-4">
      <div class="w-full px-3">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block tracking-wide text-gray-700 text-xs font-bold mb-2">App_Acronym</label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="APP" name="App_Acronym" required />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-4">
      <div class="w-full px-3">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block tracking-wide text-gray-700 text-xs font-bold mb-2">App_Description</label>
        <textarea class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="What is this application about?" name="App_Description" required />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-4">
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block tracking-wide text-gray-700 text-xs font-bold mb-2">App_Rnumber</label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="number" placeholder="001" min="0" required />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block tracking-wide text-gray-700 text-xs font-bold mb-2">App_startDate</label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="date" required />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block tracking-wide text-gray-700 text-xs font-bold mb-2">App_endDate</label>
        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="date" required />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-4">
      <div class="w-full px-3">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block tracking-wide text-gray-700 text-xs font-bold mb-2">App_permit_Create</label>
        <div class="relative">
          <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="usergroup">
            <option></option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-4">
      <div class="w-full px-3">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block tracking-wide text-gray-700 text-xs font-bold mb-2">App_permit_Open</label>
        <div class="relative">
          <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="usergroup">
            <option></option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-4">
      <div class="w-full px-3">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block tracking-wide text-gray-700 text-xs font-bold mb-2">App_permit_toDoList</label>
        <div class="relative">
          <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="usergroup">
            <option></option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-4">
      <div class="w-full px-3">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="block tracking-wide text-gray-700 text-xs font-bold mb-2">App_permit_Doing</label>
        <div class="relative">
          <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="usergroup">
            <option></option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    <button class="btn btn-primary place-items-center mb-10" type="button">
      Create Application
    </button>
  </form>
</div>