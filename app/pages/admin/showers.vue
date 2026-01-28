<template>
  <div>
    <div class="mb-8 flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gerenciar Chás</h1>
        <p class="mt-2 text-gray-600">Lista de todos os chás cadastrados</p>
      </div>
    </div>

    <div class="mb-6 flex gap-4">
      <UInput
        v-model="search"
        placeholder="Buscar chás..."
        icon="i-heroicons-magnifying-glass"
        class="flex-1 max-w-md"
      />
      <USelect
        v-model="statusFilter"
        :options="statusOptions"
        placeholder="Filtrar por status"
        class="w-48"
      />
    </div>

    <UCard>
      <div v-if="filteredShowers.length === 0" class="text-center py-12">
        <p class="text-gray-500">Nenhum chá encontrado.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="shower in filteredShowers" :key="shower.id" class="hover:bg-gray-50">
              <td class="px-4 py-4">
                <p class="font-medium">{{ shower.title }}</p>
              </td>
              <td class="px-4 py-4 text-sm text-gray-600">
                {{ formatDate(shower.date) }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-600">
                {{ shower.location }}
              </td>
              <td class="px-4 py-4">
                <UBadge :color="getStatusColor(shower.status)">
                  {{ getStatusLabel(shower.status) }}
                </UBadge>
              </td>
              <td class="px-4 py-4 text-right">
                <UButton
                  :to="`/admin/showers/${shower.id}`"
                  size="xs"
                  variant="soft"
                >
                  Detalhes
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Shower } from '~/types'
import { ShowerStatus } from '~/types'

definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'admin'
})

// TODO: Load showers from API
const showers = ref<Shower[]>([])
const search = ref('')
const statusFilter = ref('')

const statusOptions = [
  { label: 'Todos', value: '' },
  { label: 'Rascunho', value: ShowerStatus.DRAFT },
  { label: 'Preferências Definidas', value: ShowerStatus.PREFERENCES_SET },
  { label: 'Catálogo em Andamento', value: ShowerStatus.CATALOG_IN_PROGRESS },
  { label: 'Catálogo Pronto', value: ShowerStatus.CATALOG_READY },
  { label: 'Aprovado', value: ShowerStatus.APPROVED },
  { label: 'Concluído', value: ShowerStatus.COMPLETED }
]

const filteredShowers = computed(() => {
  return showers.value.filter(shower => {
    const matchesSearch = shower.title.toLowerCase().includes(search.value.toLowerCase()) ||
                         shower.location.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = !statusFilter.value || shower.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

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
