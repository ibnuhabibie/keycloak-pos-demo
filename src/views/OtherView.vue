<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

// @ts-ignore
// @ts-ignore
let pageTitle = route.params.name.split('-').join(' ');
// @ts-ignore
</script>

<template>
  <h1 class="capitalize py-4">This is {{ pageTitle }} Page</h1>
</template>

