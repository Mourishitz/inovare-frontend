<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <div v-if="authInitialized">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary animate-spin" />
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
const { authInitialized } = useAuth()

useHead({
  title: 'Inovare',
  titleTemplate: 'Inovare'
})
</script>
