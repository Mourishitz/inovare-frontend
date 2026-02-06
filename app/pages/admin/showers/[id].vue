<template>
  <div>
    <div class="mb-8">
      <UButton to="/admin/showers" variant="ghost" icon="i-heroicons-arrow-left" class="mb-4">
        Voltar
      </UButton>
      <h1 class="text-3xl font-bold text-gray-900">Detalhes do Chá</h1>
    </div>

    <div class="space-y-6">
      <UCard>
        <h2 class="text-xl font-semibold mb-4">Informações do Chá</h2>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">Título</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ shower?.title }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Data</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(shower?.date) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Local</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ shower?.location }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="mt-1">
              <UBadge :color="getStatusColor(shower?.status)">
                {{ getStatusLabel(shower?.status) }}
              </UBadge>
            </dd>
          </div>
          <div class="md:col-span-2">
            <dt class="text-sm font-medium text-gray-500">Descrição</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ shower?.description }}</dd>
          </div>
        </dl>
      </UCard>

      <UCard v-if="shower?.preferences">
        <h2 class="text-xl font-semibold mb-4">Preferências</h2>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">Tema</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ shower.preferences.theme }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Orçamento</dt>
            <dd class="mt-1 text-sm text-gray-900">R$ {{ shower.preferences.budget.toFixed(2) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Número de Convidados</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ shower.preferences.guestCount }}</dd>
          </div>
          <div class="md:col-span-2">
            <dt class="text-sm font-medium text-gray-500">Pedidos Especiais</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ shower.preferences.specialRequests || 'Nenhum' }}</dd>
          </div>
        </dl>
      </UCard>

      <UCard>
        <h2 class="text-xl font-semibold mb-4">Ações</h2>
        <div class="flex gap-4">
          <UButton
            v-if="shower?.preferences && !shower?.catalogId"
            :to="`/admin/showers/${showerId}/catalog/create`"
          >
            Criar Catálogo
          </UButton>
          <UButton
            v-if="shower?.catalogId"
            :to="`/admin/showers/${showerId}/catalog/create`"
            variant="soft"
          >
            Editar Catálogo
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Shower } from '~/types'
import { ShowerStatus } from '~/types'

definePageMeta({
  middleware: ['admin'],
  layout: 'admin'
})

const route = useRoute()
const showerId = route.params.id

// TODO: Load shower details from API
const shower = ref<Shower | null>(null)

const formatDate = (date?: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('pt-BR')
}

const getStatusColor = (status?: ShowerStatus) => {
  if (!status) return 'gray'
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

const getStatusLabel = (status?: ShowerStatus) => {
  if (!status) return 'N/A'
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
