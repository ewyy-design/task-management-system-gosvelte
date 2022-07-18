<script>
  import Axios from "axios";
  import { Router, Route, Link } from "svelte-navigator";

  // My component
  import Login from "./components/Login.svelte";
  import Home from "./components/Home.svelte";
  import Profile from "./components/Profile.svelte";
  import UpdatePassword from "./components/UpdatePassword.svelte";
  import UpdateEmail from "./components/UpdateEmail.svelte";
  import UserManagementSystem from "./components/UserManagementSystem.svelte";
  import CreateUser from "./components/CreateUser.svelte";
  import UpdateUser from "./components/UpdateUser.svelte";
  import GroupManagementSystem from "./components/GroupManagementSystem.svelte";
  import CreateApp from "./components/CreateApp.svelte";
  import AppDetails from "./components/AppDetails.svelte";

  Axios.defaults.baseURL = "http://localhost:5000";
</script>

<div class="App">
  <Router>
    <div class="navbar bg-base-300 mb-4">
      <div class="flex-1">
        <Link
          to="/home"
          class="btn btn-ghost normal-case text-xl"
          style="color:black; text-decoration:none"
        >
          TMS
        </Link>
        <Link
          to="/usermanagementsystem"
          class="btn btn-ghost ml-5 normal-case text-lg"
          style="color:black; text-decoration:none"
        >
          User Management System
        </Link>
        <Link
          to="/createapp"
          class="btn btn-ghost normal-case text-lg"
          style="color:black; text-decoration:none"
        >
          Create Applications
        </Link>
      </div>
      <div class="flex-none gap-2">
        <div class="dropdown dropdown-end">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label tabIndex="0" class="btn btn-ghost">
            <label class="lowercase">Hey</label>
          </label>
          <ul
            tabIndex="0"
            class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <Link
                to="/profile"
                class="justify-between"
                style="color:black; text-decoration:none"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link to="/" style="color:black; text-decoration:none">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <Route path="/" component={Login} />
    <Route path="home" component={Home} />
    <Route path="profile" component={Profile} />
    <Route path="/updatepassword" component={UpdatePassword} />
    <Route path="/updateemail" component={UpdateEmail} />
    <Route path="/usermanagementsystem" component={UserManagementSystem} />
    <Route path="/createuser" component={CreateUser} />
    <Route
      path="/usermanagementsystem/updateuser/:username"
      component={UpdateUser}
    />
    <Route path="/creategroup" component={GroupManagementSystem} />
    <Route path="/createapp" component={CreateApp} />
    <Route path="/home/:App_Acronym" component={AppDetails} />
    <!-- <Route path="/home/:App_Acronym/updateapp/" component={UpdateApp} /> -->
    <!-- <Route path="/home/:App_Acronym/taskmanagementsystem/" component={TaskManagementSystem } /> -->
    <!-- <Route path="/home/:App_Acronym/taskmanagementsystem/createplan" component={CreatePlan} /> -->
    <!-- <Route path="/home/:App_Acronym/taskmanagementsystem/updateplan/:Plan_MVP_name" component={UpdatePlan} /> -->
    <!-- <Route path="/home/:App_Acronym/taskmanagementsystem/updatetask/:Task_name" component={UpdateAndViewTask} /> -->
  </Router>
</div>

<style>
</style>
