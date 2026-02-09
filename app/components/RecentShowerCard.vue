<template>
  <div class="flex justify-between items-center py-2 border rounded-md px-4 border-gray-200 bg-gray-100 gap-4">
    <div class="w-full">
      <p class="font-medium">Chá de {{ shower.host.username }}</p>
      <p class="text-sm text-gray-600">Data: {{ formattedDate }} - Convidados: {{shower.guests}}</p>
    </div>
    <UButton :to="`/admin/showers/${shower.id}`" size="xs" variant="soft">
      Ver
    </UButton>
  </div>
</template>

<script setup lang="ts">
import type { Shower } from '~/types'

const props = defineProps<{
  shower: Shower
}>()

const formattedDate = computed(() => {
  const date = new Date(props.shower.shower_date)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})
</script>
