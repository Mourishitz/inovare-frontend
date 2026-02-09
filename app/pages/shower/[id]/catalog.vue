<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-50 to-white">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 mb-8">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">
              {{ catalog?.name || 'Catálogo de Lingerie' }}
            </h1>
            <p class="text-lg text-gray-600">
              Seu catálogo personalizado de lingerie está pronto para revisão
            </p>
          </div>
          <UBadge 
            v-if="catalog"
            :color="getStatusColor(catalog.status)" 
            size="lg"
            class="text-base px-4 py-2"
          >
            {{ getStatusLabel(catalog.status) }}
          </UBadge>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="fetchLoading" class="text-center py-24">
      <div class="inline-flex flex-col items-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mb-4" />
        <p class="text-lg text-gray-600">Carregando seu catálogo...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !catalog" class="w-full px-4 py-24">
      <UCard>
        <div class="text-center py-8">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <Icon name="i-heroicons-exclamation-triangle" class="h-8 w-8 text-red-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar catálogo</h3>
          <p class="text-red-500 mb-6">{{ error }}</p>
          <UButton to="/" size="lg">
            Voltar para Início
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Catalog Content -->
    <template v-else-if="catalog">
      <div class="w-full px-4 sm:px-6 lg:px-8 pb-12">
        
        <!-- Catalog Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <UCard>
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <Icon name="i-heroicons-shopping-bag" class="h-6 w-6 text-pink-600" />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Total de Produtos</p>
                <p class="text-2xl font-bold text-gray-900">{{ catalog.products.length }}</p>
              </div>
            </div>
          </UCard>
          
          <UCard>
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon name="i-heroicons-check-circle" class="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Disponíveis</p>
                <p class="text-2xl font-bold text-gray-900">{{ availableCount }}</p>
              </div>
            </div>
          </UCard>
          
          <UCard>
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Icon name="i-heroicons-currency-dollar" class="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Valor Total</p>
                <p class="text-2xl font-bold text-gray-900">R$ {{ totalValue.toFixed(2) }}</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Products Grid -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Produtos do Catálogo</h2>
          
          <div v-if="catalog.products.length === 0" class="text-center py-12">
            <UCard>
              <div class="py-8">
                <Icon name="i-heroicons-inbox" class="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p class="text-gray-500">Nenhum produto adicionado ainda.</p>
              </div>
            </UCard>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <UCard 
              v-for="product in catalog.products" 
              :key="product.id"
              class="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <!-- Product Image -->
              <div class="relative aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg overflow-hidden mb-4">
                <img
                  v-if="product.imageUrl"
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                >
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Icon name="i-heroicons-photo" class="h-16 w-16 text-gray-400" />
                </div>
                
                <!-- Stock Badge -->
                <div class="absolute top-2 right-2">
                  <UBadge
                    :color="product.inStock ? 'green' : 'red'"
                    variant="solid"
                  >
                    {{ product.inStock ? 'Disponível' : 'Esgotado' }}
                  </UBadge>
                </div>
              </div>
              
              <!-- Product Info -->
              <div class="space-y-2">
                <h3 class="font-semibold text-lg text-gray-900 line-clamp-1">
                  {{ product.name }}
                </h3>
                <p class="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                  {{ product.description }}
                </p>
                <div class="pt-2 border-t border-gray-200">
                  <p class="text-2xl font-bold text-pink-600">
                    R$ {{ product.price.toFixed(2) }}
                  </p>
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Review Section -->
        <div v-if="catalog.status === 'ready_for_review'" class="mt-12">
          <UCard class="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200">
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="h-12 w-12 rounded-full bg-pink-200 flex items-center justify-center">
                    <Icon name="i-heroicons-clipboard-document-check" class="h-6 w-6 text-pink-700" />
                  </div>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">
                    Revisar Catálogo
                  </h3>
                  <p class="text-gray-600">
                    Revise os produtos acima e aprove o catálogo ou solicite alterações adicionando seus comentários abaixo.
                  </p>
                </div>
              </div>

              <form class="space-y-6" @submit.prevent="handleReview">
                <UFormGroup 
                  label="Comentários ou Sugestões" 
                  name="comments"
                  help="Opcional: Adicione comentários se desejar solicitar alterações"
                >
                  <UTextarea
                    v-model="review.comments"
                    placeholder="Ex: Gostaria de adicionar mais opções na cor vermelha..."
                    :rows="4"
                    :disabled="loading"
                  />
                </UFormGroup>

                <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div class="flex items-center space-x-2">
                    <Icon name="i-heroicons-exclamation-circle" class="h-5 w-5 text-red-600" />
                    <p class="text-sm text-red-700">{{ error }}</p>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                  <UButton
                    type="button"
                    :loading="loading"
                    color="green"
                    size="lg"
                    class="flex-1"
                    @click="handleApprove"
                  >
                    <Icon name="i-heroicons-check-circle" class="mr-2" />
                    Aprovar Catálogo
                  </UButton>
                  <UButton
                    type="submit"
                    :loading="loading"
                    color="orange"
                    variant="soft"
                    size="lg"
                    class="flex-1"
                  >
                    <Icon name="i-heroicons-chat-bubble-left-right" class="mr-2" />
                    Solicitar Alterações
                  </UButton>
                  <UButton
                    to="/"
                    variant="ghost"
                    size="lg"
                    :disabled="loading"
                  >
                    Voltar
                  </UButton>
                </div>
              </form>
            </div>
          </UCard>
        </div>

        <!-- Approved State -->
        <div v-else-if="catalog.status === 'approved'" class="mt-12">
          <UCard class="bg-green-50 border-2 border-green-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="h-16 w-16 rounded-full bg-green-200 flex items-center justify-center">
                  <Icon name="i-heroicons-check-circle" class="h-10 w-10 text-green-700" />
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-green-900 mb-1">
                    Catálogo Aprovado!
                  </h3>
                  <p class="text-green-700">
                    Seu catálogo foi aprovado e está pronto para uso.
                  </p>
                </div>
              </div>
              <UButton to="/" size="lg" color="green">
                Voltar para Início
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Catalog } from '~/types'
import { CatalogStatus } from '~/types'

definePageMeta({
  middleware: ['user'],
  layout: 'authenticated'
})

const route = useRoute()
const router = useRouter()
const showerId = route.params.id
const { apiCall } = useApi()

const catalog = ref<Catalog | null>(null)

const review = reactive({
  comments: ''
})

const loading = ref(false)
const error = ref('')
const fetchLoading = ref(true)

// Backend response interface
interface BackendCatalogResponse {
  catalog: {
    ID: number
    approved: boolean
    url: string
    package: string
    CreatedAt: string
    UpdatedAt: string
  }
  products: Array<{
    ID: number
    price: number
    is_bought: boolean
    product: {
      ID: number
      name: string
      description: string
      image_url: string
    }
  }>
}

// Computed properties
const availableCount = computed(() => 
  catalog.value?.products.filter(p => p.inStock).length || 0
)

const totalValue = computed(() => 
  catalog.value?.products.reduce((sum, p) => sum + p.price, 0) || 0
)

// Fetch catalog on mount
onMounted(async () => {
  try {
    const response = await apiCall<BackendCatalogResponse>(`/api/showers/${showerId}/catalog`)
    
    // Transform backend response to frontend format
    catalog.value = {
      id: response.catalog.ID.toString(),
      showerId: showerId as string,
      name: `Catálogo - ${response.catalog.package}`,
      status: response.catalog.approved ? CatalogStatus.APPROVED : CatalogStatus.READY_FOR_REVIEW,
      products: response.products.map(item => ({
        id: item.product.ID.toString(),
        name: item.product.name,
        description: item.product.description,
        price: item.price,
        imageUrl: item.product.image_url,
        category: '',
        inStock: !item.is_bought
      })),
      createdAt: response.catalog.CreatedAt,
      updatedAt: response.catalog.UpdatedAt
    }
  } catch (err) {
    const apiError = err as { data?: { error?: string } }
    error.value = apiError.data?.error || 'Erro ao carregar catálogo'
    console.error('Error fetching catalog:', err)
  } finally {
    fetchLoading.value = false
  }
})

const getStatusColor = (status?: CatalogStatus) => {
  if (!status) return 'gray'
  const colors = {
    draft: 'gray',
    ready_for_review: 'blue',
    approved: 'green',
    changes_requested: 'yellow'
  }
  return colors[status] || 'gray'
}

const getStatusLabel = (status?: CatalogStatus) => {
  if (!status) return 'N/A'
  const labels = {
    draft: 'Rascunho',
    ready_for_review: 'Pronto para Revisão',
    approved: 'Aprovado',
    changes_requested: 'Alterações Solicitadas'
  }
  return labels[status] || status
}

const handleApprove = async () => {
  loading.value = true
  error.value = ''

  try {
    await apiCall(`/api/showers/${showerId}/catalog/approve`, {
      method: 'POST',
      body: JSON.stringify({
        approved: true,
        comments: review.comments || ''
      })
    })
    router.push('/')
  } catch (err) {
    const apiError = err as { data?: { error?: string } }
    error.value = apiError.data?.error || 'Erro ao aprovar catálogo.'
    console.error('Error approving catalog:', err)
  } finally {
    loading.value = false
  }
}

const handleReview = async () => {
  loading.value = true
  error.value = ''

  try {
    await apiCall(`/api/showers/${showerId}/catalog/approve`, {
      method: 'POST',
      body: JSON.stringify({
        approved: false,
        comments: review.comments
      })
    })
    router.push('/')
  } catch (err) {
    const apiError = err as { data?: { error?: string } }
    error.value = apiError.data?.error || 'Erro ao enviar comentários.'
    console.error('Error requesting changes:', err)
  } finally {
    loading.value = false
  }
}
</script>
