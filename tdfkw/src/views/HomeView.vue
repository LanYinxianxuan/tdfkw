<script setup>
import { useRouter } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue';
import Nav from '@/components/NAV.vue'

const router = useRouter()
</script>
<template>
  <Nav />
  <HelloWorld />
  <button @click="router.push('/start')">现在开始</button>
</template>
