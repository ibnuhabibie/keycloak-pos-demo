<script setup>
// @ts-ignore
import { computed, ref, watch } from 'vue';
// @ts-ignore
import { useAppStore } from '@/store';
import { storeToRefs } from "pinia";

// @ts-ignore
const appStore = useAppStore()
const { keycloak, token } = storeToRefs(appStore);

let logoutUrl = ref('');
let fullName = ref('');
let encodedToken = ref(null);

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

// @ts-ignore
watch([keycloak, token], ([newKc, oldKc], [newTk, oldTk]) => {
  if (newKc) {
    console.log(newKc.createLogoutUrl());
    logoutUrl.value = newKc.createLogoutUrl();
  }

  if (newTk) {
    console.log(newTk);
    encodedToken.value = parseJwt(newTk);
    console.log(encodedToken.value);
    // @ts-ignore
    fullName.value = encodedToken.value.given_name + ' ' + encodedToken.value.family_name;
  }
})

// @ts-ignore
</script>

<template>
  <div class="h-screen w-full text-center flex flex-col gap-2 items-center justify-center" v-if="encodedToken">
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
      <tr>
        <th class="p-4 border">Role</th>
        <td class="p-4 border">
          <span v-for="role in encodedToken.resource_access.pos.roles" class="bg-gray-100 p-2 rounded">
            {{ role }}
          </span>
        </td>
      </tr>
    </table>
    <RouterView />
    <div class="absolute right-5 top-5">
      <a :href="logoutUrl" class="px-4 py-2 bg-red-600 text-white rounded">Logout</a>
    </div>
    <div class="absolute bottom-0 left-auto bg-gray-300 flex gap-3 w-1/2 justify-center rounded h-10">
      <a class="bg-gray-100 px-3 rounded mt-[-50px] h-20 flex items-center" href="https://keycloak-pos.on-dev.info">
        <img src="https://www.freeiconspng.com/uploads/point-of-sale-icon-7.png" width="50">
      </a>
      <a class="bg-gray-100 px-3 rounded mt-[-50px] h-20 flex items-center" href="https://keycloak-crm.on-dev.info">
        <img
          src="https://e7.pngegg.com/pngimages/116/111/png-clipart-ab-brothers-pvt-ltd-company-salesforce-com-computer-icons-crm-icon-company-text.png"
          width="50">
      </a>
    </div>
  </div>
</template>