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
        placeholder="Buscar por anfitriã ou local..."
        icon="i-heroicons-magnifying-glass"
        class="flex-1 max-w-md"
      />
    </div>

    <div v-if="loading" class="text-center py-8">
      <p>Carregando...</p>
    </div>

    <div v-else-if="error" class="py-8">
      <UAlert color="red" variant="soft" title="Erro ao carregar chás" :description="error" />
    </div>

    <UCard v-else>
      <div v-if="filteredShowers.length === 0" class="text-center py-12">
        <p class="text-gray-500">Nenhum chá encontrado.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anfitriã</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data do Chá</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Convidados</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catálogo</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="shower in filteredShowers" :key="shower.ID" class="hover:bg-gray-50">
              <td class="px-4 py-4">
                <p class="font-medium">{{ shower.host?.username }}</p>
                <p class="text-xs text-gray-500">{{ shower.host?.email }}</p>
              </td>
              <td class="px-4 py-4 text-sm text-gray-600">
                {{ formatDate(shower.shower_date) }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-600">
                {{ shower.location }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-600">
                {{ shower.guests }}
              </td>
              <td class="px-4 py-4">
                <UBadge v-if="shower.catalog" :color="shower.catalog.approved ? 'green' : 'yellow'">
                  {{ shower.catalog.approved ? 'Aprovado' : 'Pendente' }}
                </UBadge>
                <span v-else class="text-xs text-gray-400">Sem catálogo</span>
              </td>
              <td class="px-4 py-4 text-right">
                <UButton
                  :to="`/admin/showers/${shower.ID}`"
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

      <!-- Pagination -->
      <div v-if="pagination && pagination.total_pages > 1" class="mt-4 flex justify-center">
        <div class="flex gap-2">
          <UButton
            :disabled="pagination.page === 1"
            @click="goToPage(pagination.page - 1)"
            size="xs"
            variant="outline"
          >
            Anterior
          </UButton>
          <span class="px-4 py-2 text-sm text-gray-600">
            Página {{ pagination.page }} de {{ pagination.total_pages }}
          </span>
          <UButton
            :disabled="pagination.page === pagination.total_pages"
            @click="goToPage(pagination.page + 1)"
            size="xs"
            variant="outline"
          >
            Próxima
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Shower } from '~/types'

definePageMeta({
  middleware: ['admin'],
  layout: 'admin'
})

interface ShowersResponse {
  data: Shower[]
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
  }
}

const showers = ref<Shower[]>([])
const pagination = ref<ShowersResponse['pagination'] | null>(null)
const search = ref('')
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)

const filteredShowers = computed(() => {
  if (!search.value) return showers.value
  
  const searchLower = search.value.toLowerCase()
  return showers.value.filter(shower => {
    const hostName = shower.host?.username?.toLowerCase() || ''
    const location = shower.location?.toLowerCase() || ''
    return hostName.includes(searchLower) || location.includes(searchLower)
  })
})

const { formatDate } = useDate()

const loadShowers = async (page: number = 1) => {
  try {
    loading.value = true
    error.value = null
    const { apiCall } = useApi()
    const response = await apiCall<ShowersResponse>(`/api/showers?page=${page}&page_size=10`)
    showers.value = response.data
    pagination.value = response.pagination
    currentPage.value = page
  } catch (err: any) {
    console.error('Error loading showers:', err)
    error.value = err?.message || 'Erro ao carregar chás'
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  loadShowers(page)
}

onMounted(() => {
  loadShowers()
})
</script>
