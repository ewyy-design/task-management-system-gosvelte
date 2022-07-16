<script>
  import {Link} from "svelte-navigator"
</script>

<div class="flex flex-col w-full">
  <div class="text-sm breadcrumbs m-7">
    <ul>
      <li>
        <Link to="/home" style="color:black">Home</Link>
      </li>
      <li>Application 's Details</li>
    </ul>
  </div>
  <div class="text-2xl font-bold place-self-center ">
    <strong></strong>
  </div>
  <div>
    <div class="flex flex-col w-full lg:flex-row">
      <div class="grid flex-grow card bg-base-300 rounded-box m-10 pt-4 ">
        <div class="w-full max-w-lg place-self-center">
          <div class="flex flex-wrap -mx-3 mb-4">
            <div class="w-full px-3">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="block text-black text-sm font-bold mb-2">Description</label>
              <p></p>
            </div>
          </div>
          <div class="flex flex-wrap -mx-3 mb-4">
            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="block text-black text-sm font-bold mb-2">App_startDate</label>
              <p></p>
            </div>
            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="block text-black text-sm font-bold mb-2">App_endDate</label>
              <p></p>
            </div>
          </div>
          <div class="flex flex-wrap -mx-40 mb-4">
            <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="block text-black text-sm font-bold mb-2">App_permit_Create</label>
              <p></p>
            </div>
            <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="block text-black text-sm font-bold mb-2">App_permit_Open</label>
              <p></p>
            </div>
            <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="block text-black text-sm font-bold mb-2">App_permit_toDoList</label>
              <p></p>
            </div>
            <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="block text-black text-sm font-bold mb-2">App_permit_Doing</label>
              <p></p>
            </div>
            <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label class="block text-black text-sm font-bold mb-2">App_permit_Done</label>
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 content-center pb-10 ...">
     
        <div>
          <Link to="updateapp/">
            <button type="button" class="btn btn-primary ">
              Edit Application
            </button>
          </Link>
        </div>

      <div>
        <Link to="taskmanagementsystem/">
          <button type="button" class="btn btn-primary ">
            Plans & Tasks
          </button>
        </Link>
      </div>
    </div>
  </div>
</div>