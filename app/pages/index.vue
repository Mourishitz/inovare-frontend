<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Meus Chás de Lingerie</h1>
      <p class="mt-2 text-gray-600">Gerencie seus chás de lingerie</p>
    </div>

    <div class="mb-6">
      <UButton to="/shower/create" icon="i-heroicons-plus">
        Criar Novo Chá
      </UButton>
    </div>

    <UCard>
      <div v-if="showers.length === 0" class="text-center py-12">
        <p class="text-gray-500">Você ainda não criou nenhum chá.</p>
        <p class="text-sm text-gray-400 mt-2">Clique no botão acima para começar!</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="shower in showers"
          :key="shower.id"
          class="border rounded-lg p-4 hover:bg-gray-50 transition"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold text-lg">{{ shower.title }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ shower.date }}</p>
              <p class="text-sm text-gray-500">{{ shower.location }}</p>
              <UBadge :color="getStatusColor(shower.status)" class="mt-2">
                {{ getStatusLabel(shower.status) }}
              </UBadge>
            </div>
            <div class="flex gap-2">
              <UButton
                v-if="shower.status === 'draft'"
                :to="`/shower/${shower.id}/preferences`"
                variant="soft"
                size="sm"
              >
                Definir Preferências
              </UButton>
              <UButton
                v-if="shower.status === 'catalog_ready'"
                :to="`/shower/${shower.id}/catalog`"
                variant="soft"
                size="sm"
              >
                Ver Catálogo
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Shower } from '~/types'
import { ShowerStatus } from '~/types'

definePageMeta({
  middleware: ['auth', 'user'],
  layout: 'authenticated'
})

// TODO: Replace with actual API call
const showers = ref<Shower[]>([])

const getStatusColor = (status: ShowerStatus) => {
  const colors = {
    [ShowerStatus.DRAFT]: 'gray',
    [ShowerStatus.PREFERENCES_SET]: 'blue',
    [ShowerStatus.CATALOG_IN_PROGRESS]: 'yellow',
    [ShowerStatus.CATALOG_READY]: 'green',
    [ShowerStatus.APPROVED]: 'primary',
    [ShowerStatus.COMPLETED]: 'gray'
  }
  return colors[status] || 'gray'
}

const getStatusLabel = (status: ShowerStatus) => {
  const labels = {
    [ShowerStatus.DRAFT]: 'Rascunho',
    [ShowerStatus.PREFERENCES_SET]: 'Preferências Definidas',
    [ShowerStatus.CATALOG_IN_PROGRESS]: 'Catálogo em Andamento',
    [ShowerStatus.CATALOG_READY]: 'Catálogo Pronto',
    [ShowerStatus.APPROVED]: 'Aprovado',
    [ShowerStatus.COMPLETED]: 'Concluído'
  }
  return labels[status] || status
}
</script>
