<script setup>
import { computed, ref, watch } from 'vue';
import axios from 'axios';
import { useAppStore } from '@/store';
import { storeToRefs } from "pinia";
// import keycloak from 'keycloak-js';

const appStore = useAppStore()
const { keycloak } = storeToRefs(appStore);

let logoutUrl = ref('');

let token = localStorage.getItem('token')

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

let encodedToken = token ? parseJwt(token) : null;

let fullName = computed(() => encodedToken.given_name + ' ' + encodedToken.family_name)

watch(keycloak, (newVal, oldVal) => {
  if (newVal) {
    console.log(newVal.createLogoutUrl());
    logoutUrl.value = newVal.createLogoutUrl();
  }
})

</script>

<template>
  <div class="h-screen w-full text-center flex flex-col gap-2 items-center justify-center">
    <h1 class="text-3xl">Welcome to <b>POS</b></h1>
    <p class="font-thin text-2xl">
      Streamlining Your Business Transactions and Beyond!
    </p>
    <div class="flex gap-2 mt-8">
      <a href="/" class="bg-gray-100 p-2 rounded">Inventory Management</a>
      <a href="" class="bg-gray-100 p-2 rounded">Customer Management</a>
      <a href="" class="bg-gray-100 p-2 rounded">Item Management</a>
      <a href="" class="bg-gray-100 p-2 rounded">Employee Management</a>
      <a href="" class="bg-gray-100 p-2 rounded">Settings</a>
    </div>
    <table class="w-1/2 mt-8 border text-left">
      <tr>
        <th class="p-4 border">Username</th>
        <td class="p-4 border">{{ encodedToken.preferred_username }}</td>
      </tr>
      <tr>
        <th class="p-4 border">Fullname:</th>
        <td class="p-4 border">{{ fullName }}</td>
      </tr>
      <tr>
        <th class="p-4 border">Email</th>
        <td class="p-4 border">{{ encodedToken.email }}</td>
      </tr>
    </table>
    <RouterView />
    <div class="absolute right-5 top-5">
      <a :href="logoutUrl" class="px-4 py-2 bg-red-600 text-white rounded">Logout</a>
    </div>
    <div class="absolute bottom-0 left-auto bg-gray-300 flex gap-3 w-1/2 justify-center rounded h-10">
      <a class="bg-gray-100 px-3 rounded mt-[-50px] h-20 flex items-center" href="#">
        <img src="https://www.freeiconspng.com/uploads/point-of-sale-icon-7.png" width="50">
      </a>
      <a class="bg-gray-100 px-3 rounded mt-[-50px] h-20 flex items-center" href="#">
        <img
          src="https://e7.pngegg.com/pngimages/116/111/png-clipart-ab-brothers-pvt-ltd-company-salesforce-com-computer-icons-crm-icon-company-text.png"
          width="50">
      </a>
    </div>
  </div>
</template>