import { writable } from "svelte/store";
import Axios from "axios";

const cart = writable([
  {
    id: "p1",
    title: "test",
    price: 9.99,
  },
  {
    id: "p1",
    title: "test",
    price: 9.99,
  },
]);

export const userData = writable([]);

export const fetchData = async () => {
  const url = `http://localhost:5000/users`;
  const res = await fetch(url);
  const data = await res.json();
  console.log("DATA: ", data);
  const loadedData = data.map((data, index) => ({
    index: index,
    name: data.name,
    email: data.email,
    password: data.password,
    usergroup: data.usergroup,
    isActive: data.enable,
  }));
  userData.set(loadedData);
};

export default cart;
