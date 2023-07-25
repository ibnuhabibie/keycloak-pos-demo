<script setup>
const props = defineProps(['data'])
let access = props.data
</script>

<template>
  <div class="flex gap-2 mt-8">
    <router-link to="/inventory-management" class="bg-gray-100 p-2 rounded flex gap-2">
      <span>Inventory Management</span>
      <div v-if="access.includes('inventory.management')">✅</div>
      <div v-else>❌</div>
    </router-link>
    <router-link to="/customer-management" class="bg-gray-100 p-2 rounded flex gap-2">
      <span>Customer Management</span>
      <div v-if="access.includes('customer.management')">✅</div>
      <div v-else>❌</div>
    </router-link>
    <router-link to="/item-management" class="bg-gray-100 p-2 rounded flex gap-2">
      <span>Item Management</span>
      <div v-if="access.includes('item.management')">✅</div>
      <div v-else>❌</div>
    </router-link>
    <router-link to="/employee-management" class="bg-gray-100 p-2 rounded flex gap-2">
      <span>Employee Management</span>
      <div v-if="access.includes('employee.management')">✅</div>
      <div v-else>❌</div>
    </router-link>
    <router-link to="/settings" class="bg-gray-100 p-2 rounded flex gap-2">
      <span>Settings</span>
      <div v-if="access.includes('settings')">✅</div>
      <div v-else>❌</div>
    </router-link>
  </div>
</template>