<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
      <p class="mt-2 text-gray-600">Visão geral do sistema</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UCard>
        <div class="text-center">
          <p class="text-3xl font-bold text-primary-600">{{ stats.totalShowers }}</p>
          <p class="text-sm text-gray-600 mt-1">Total de Chás</p>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <p class="text-3xl font-bold text-yellow-600">{{ stats.pendingReview }}</p>
          <p class="text-sm text-gray-600 mt-1">Aguardando Revisão</p>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <p class="text-3xl font-bold text-green-600">{{ stats.completed }}</p>
          <p class="text-sm text-gray-600 mt-1">Concluídos</p>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UCard>
        <h2 class="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div class="space-y-3">
          <UButton to="/admin/showers" block variant="soft">
            Ver Todos os Chás
          </UButton>
          <UButton to="/admin/products" block variant="soft">
            Gerenciar Produtos
          </UButton>
        </div>
      </UCard>

      <UCard>
        <h2 class="text-xl font-semibold mb-4">Chás Recentes</h2>
        <div class="space-y-2">
          <div
            v-for="shower in recentShowers"
            :key="shower.id"
            class="flex justify-between items-center py-2 border-b last:border-0"
          >
            <div>
              <p class="font-medium">{{ shower.title }}</p>
              <p class="text-sm text-gray-600">{{ shower.date }}</p>
            </div>
            <UButton :to="`/admin/showers/${shower.id}`" size="xs" variant="soft">
              Ver
            </UButton>
          </div>
          <p v-if="recentShowers.length === 0" class="text-gray-500 text-sm text-center py-4">
            Nenhum chá cadastrado
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Shower } from '~/types'

definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'admin'
})

// TODO: Load stats and recent showers from API
const stats = ref({
  totalShowers: 0,
  pendingReview: 0,
  completed: 0
})

const recentShowers = ref<Shower[]>([])
</script>
