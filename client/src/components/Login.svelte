<script>
  import { fetchData, userData } from "./store";
  fetchData();
  let username = [];
  // console.log($userData);
  userData.subscribe((item) => {
    username = item[0];
    console.log("username: ", username);
  });
</script>

<main>
  {#if username}
    {username.name}
  {/if}
  <div class="relative flex flex-col justify-center min-h-screen ">
    <div
      class="w-full p-6 m-auto bg-white rounded shadow-lg ring-2 lg:max-w-md"
    >
      <div class="flex justify-center">
        <img
          src="https://www.outsystems.com/Forge_BL/rest/ComponentThumbnail/GetURL_ComponentThumbnail?ProjectImageId=25068"
          alt="logo"
        />
      </div>
      <h3 class="text-2xl font-bold text-center">Task Management System</h3>
      <div class="mt-6">
        <div>
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label for="username" class="block text-sm text-gray-800">
            Username
          </label>
          <input
            type="text"
            class="block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            name="username"
          />
        </div>
        <div class="mt-4">
          <div>
            <label for="password" class="block text-sm text-gray-800">
              Password
            </label>
            <input
              type="password"
              class="block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              name="password"
            />
          </div>
          <div class="mt-6">
            <button
              class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-primary rounded-md hover:bg-blue-600 focus:outline-none focus:primary-focus"
            >
              Login
            </button>
            <!--   {message && (
              <div>
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-4 rounded relative" role="alert">
                  {message}
                </div>
              </div>
            )} -->
          </div>
        </div>
      </div>
    </div>
    <footer class="border-top text-center p-4 bg-base-300 text-base-content">
      <p class="m-0">
        Copyright &copy; {new Date().getFullYear()}{" "}
        <a href="/" class="text-muted"> Task Management System </a>
        . All rights reserved.
      </p>
    </footer>
  </div>
</main>

<style>
  main {
    text-align: center;
  }
  img {
    width: 125px;
  }
</style>
