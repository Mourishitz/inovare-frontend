<template>
  <div>
    <div class="mb-8">
      <UButton :to="`/admin/showers/${showerId}`" variant="ghost" icon="i-heroicons-arrow-left" class="mb-4">
        Voltar
      </UButton>
      <h1 class="text-3xl font-bold text-gray-900">{{ isEditing ? 'Editar' : 'Criar' }} Catálogo de Lingerie</h1>
      <p class="mt-2 text-gray-600">Adicione peças íntimas ao catálogo do chá</p>
    </div>

    <div class="space-y-6">
      <UCard>
        <form @submit.prevent="handleSaveCatalog" class="space-y-4">
          <UFormGroup label="Nome do Catálogo" name="name" required>
            <UInput
              v-model="catalog.name"
              placeholder="Ex: Catálogo Premium"
              :disabled="loading"
            />
          </UFormGroup>

          <div class="flex justify-end">
            <UButton type="submit" :loading="loading" size="sm">
              Salvar Informações
            </UButton>
          </div>
        </form>
      </UCard>

      <UCard>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Peças Selecionadas</h2>
          <UButton @click="showProductModal = true" icon="i-heroicons-plus" size="sm">
            Adicionar Peça
          </UButton>
        </div>

        <div v-if="selectedProducts.length === 0" class="text-center py-8 text-gray-500">
          Nenhuma peça adicionada ao catálogo
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard v-for="product in selectedProducts" :key="product.id">
            <div class="space-y-2">
              <div class="flex justify-between items-start">
                <h3 class="font-semibold">{{ product.name }}</h3>
                <UButton
                  @click="removeProduct(product.id)"
                  icon="i-heroicons-x-mark"
                  size="xs"
                  color="red"
                  variant="ghost"
                />
              </div>
              <p class="text-sm text-gray-600">{{ product.description }}</p>
              <p class="text-lg font-bold text-primary-600">R$ {{ product.price.toFixed(2) }}</p>
            </div>
          </UCard>
        </div>
      </UCard>

      <div class="flex gap-4">
        <UButton @click="handleFinalize" :loading="loading" :disabled="selectedProducts.length === 0">
          Finalizar e Enviar para Revisão
        </UButton>
        <UButton :to="`/admin/showers/${showerId}`" variant="ghost" :disabled="loading">
          Cancelar
        </UButton>
      </div>
    </div>

    <!-- Product Selection Modal -->
    <UModal v-model="showProductModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Selecionar Peças de Lingerie</h3>
        </template>

        <div class="space-y-4">
          <UInput
            v-model="productSearch"
            placeholder="Buscar peças..."
            icon="i-heroicons-magnifying-glass"
          />

          <div class="max-h-96 overflow-y-auto space-y-2">
            <div
              v-for="product in availableProducts"
              :key="product.id"
              class="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
            >
              <div>
                <p class="font-medium">{{ product.name }}</p>
                <p class="text-sm text-gray-600">R$ {{ product.price.toFixed(2) }}</p>
              </div>
              <UButton
                @click="addProduct(product)"
                size="xs"
                :disabled="isProductSelected(product.id)"
              >
                {{ isProductSelected(product.id) ? 'Adicionado' : 'Adicionar' }}
              </UButton>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton @click="showProductModal = false" variant="ghost">
              Fechar
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({
  middleware: ['admin'],
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const showerId = route.params.id

const catalog = reactive({
  name: '',
  showerId: showerId as string
})

const selectedProducts = ref<Product[]>([])
const showProductModal = ref(false)
const productSearch = ref('')
const loading = ref(false)
const isEditing = ref(false)

// TODO: Load available products from API
const allProducts = ref<Product[]>([])

const availableProducts = computed(() => {
  if (!productSearch.value) return allProducts.value
  return allProducts.value.filter(p =>
    p.name.toLowerCase().includes(productSearch.value.toLowerCase())
  )
})

const isProductSelected = (productId: string) => {
  return selectedProducts.value.some(p => p.id === productId)
}

const addProduct = (product: Product) => {
  if (!isProductSelected(product.id)) {
    selectedProducts.value.push(product)
  }
}

const removeProduct = (productId: string) => {
  selectedProducts.value = selectedProducts.value.filter(p => p.id !== productId)
}

const handleSaveCatalog = async () => {
  loading.value = true
  try {
    // TODO: API call to save catalog info
    console.log('Saving catalog:', catalog)
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (err) {
    console.error('Error saving catalog:', err)
  } finally {
    loading.value = false
  }
}

const handleFinalize = async () => {
  loading.value = true
  try {
    // TODO: API call to finalize catalog
    console.log('Finalizing catalog:', { ...catalog, products: selectedProducts.value })
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push(`/admin/showers/${showerId}`)
  } catch (err) {
    console.error('Error finalizing catalog:', err)
  } finally {
    loading.value = false
  }
}
</script>
