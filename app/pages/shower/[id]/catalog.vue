<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Catálogo de Lingerie</h1>
      <p class="mt-2 text-gray-600">Revise o catálogo de lingerie criado para o seu chá</p>
    </div>

    <UCard class="mb-6">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-xl font-semibold">{{ catalog?.name || 'Catálogo' }}</h2>
          <UBadge :color="getStatusColor(catalog?.status)" class="mt-2">
            {{ getStatusLabel(catalog?.status) }}
          </UBadge>
        </div>
      </div>
    </UCard>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <UCard v-for="product in catalog?.products" :key="product.id">
        <div class="space-y-3">
          <div v-if="product.imageUrl" class="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <NuxtImg
              :src="product.imageUrl"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div v-else class="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
            <span class="text-gray-400">Sem imagem</span>
          </div>
          
          <div>
            <h3 class="font-semibold">{{ product.name }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ product.description }}</p>
            <p class="text-lg font-bold text-primary-600 mt-2">
              R$ {{ product.price.toFixed(2) }}
            </p>
            <UBadge
              :color="product.inStock ? 'green' : 'red'"
              class="mt-2"
              size="xs"
            >
              {{ product.inStock ? 'Em Estoque' : 'Esgotado' }}
            </UBadge>
          </div>
        </div>
      </UCard>
    </div>

    <UCard v-if="catalog?.status === 'ready_for_review'">
      <form @submit.prevent="handleReview" class="space-y-6">
        <h3 class="text-lg font-semibold">Revisar Catálogo</h3>
        
        <UFormGroup label="Comentários" name="comments">
          <UTextarea
            v-model="review.comments"
            placeholder="Adicione comentários ou sugestões..."
            :rows="4"
            :disabled="loading"
          />
        </UFormGroup>

        <div v-if="error" class="text-sm text-red-600">
          {{ error }}
        </div>

        <div class="flex gap-4">
          <UButton
            type="button"
            @click="handleApprove"
            :loading="loading"
            color="green"
          >
            Aprovar Catálogo
          </UButton>
          <UButton
            type="submit"
            :loading="loading"
            variant="soft"
          >
            Solicitar Alterações
          </UButton>
          <UButton
            to="/"
            variant="ghost"
            :disabled="loading"
          >
            Voltar
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Catalog, CatalogStatus } from '~/types'

definePageMeta({
  middleware: ['user'],
  layout: 'authenticated'
})

const route = useRoute()
const router = useRouter()
const showerId = route.params.id

// TODO: Load catalog from API
const catalog = ref<Catalog | null>(null)

const review = reactive({
  comments: ''
})

const loading = ref(false)
const error = ref('')

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
    // TODO: API call to approve catalog
    console.log('Approving catalog for shower:', showerId)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/')
  } catch (err) {
    error.value = 'Erro ao aprovar catálogo.'
  } finally {
    loading.value = false
  }
}

const handleReview = async () => {
  loading.value = true
  error.value = ''

  try {
    // TODO: API call to request changes
    console.log('Requesting changes for shower:', showerId, review)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/')
  } catch (err) {
    error.value = 'Erro ao enviar comentários.'
  } finally {
    loading.value = false
  }
}
</script>