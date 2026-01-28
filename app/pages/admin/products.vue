<template>
  <div>
    <div class="mb-8 flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gerenciar Peças de Lingerie</h1>
        <p class="mt-2 text-gray-600">Catálogo de peças íntimas disponíveis</p>
      </div>
      <UButton @click="showProductForm = true" icon="i-heroicons-plus">
        Nova Peça
      </UButton>
    </div>

    <div class="mb-6">
      <UInput
        v-model="search"
        placeholder="Buscar peças de lingerie..."
        icon="i-heroicons-magnifying-glass"
        class="max-w-md"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="product in filteredProducts" :key="product.id">
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
            <p class="text-lg font-bold text-primary-600 mt-2">R$ {{ product.price.toFixed(2) }}</p>
            <div class="flex items-center justify-between mt-2">
              <UBadge :color="product.inStock ? 'green' : 'red'" size="xs">
                {{ product.inStock ? 'Em Estoque' : 'Esgotado' }}
              </UBadge>
              <div class="flex gap-2">
                <UButton @click="editProduct(product)" size="xs" variant="soft">
                  Editar
                </UButton>
                <UButton @click="deleteProduct(product.id)" size="xs" color="red" variant="ghost">
                  Excluir
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <div v-if="filteredProducts.length === 0" class="col-span-full text-center py-12 text-gray-500">
        Nenhuma peça encontrada
      </div>
    </div>

    <!-- Product Form Modal -->
    <UModal v-model="showProductForm">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">{{ editingProduct ? 'Editar' : 'Nova' }} Peça</h3>
        </template>

        <form @submit.prevent="handleSubmitProduct" class="space-y-4">
          <UFormGroup label="Nome" name="name" required>
            <UInput v-model="productForm.name" :disabled="loading" />
          </UFormGroup>

          <UFormGroup label="Descrição" name="description">
            <UTextarea v-model="productForm.description" :rows="3" :disabled="loading" />
          </UFormGroup>

          <UFormGroup label="Preço (R$)" name="price" required>
            <UInput v-model.number="productForm.price" type="number" step="0.01" :disabled="loading" />
          </UFormGroup>

          <UFormGroup label="URL da Imagem" name="imageUrl">
            <UInput v-model="productForm.imageUrl" :disabled="loading" />
          </UFormGroup>

          <UFormGroup label="Categoria" name="category">
            <UInput v-model="productForm.category" placeholder="Ex: Conjunto, Baby Doll, Camisola" :disabled="loading" />
          </UFormGroup>

          <UFormGroup label="Em Estoque" name="inStock">
            <UCheckbox v-model="productForm.inStock" :disabled="loading" />
          </UFormGroup>
        </form>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton @click="closeProductForm" variant="ghost" :disabled="loading">
              Cancelar
            </UButton>
            <UButton @click="handleSubmitProduct" :loading="loading">
              Salvar
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
  middleware: ['auth', 'admin'],
  layout: 'admin'
})

// TODO: Load products from API
const products = ref<Product[]>([])
const search = ref('')
const showProductForm = ref(false)
const editingProduct = ref<Product | null>(null)
const loading = ref(false)

const productForm = reactive({
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  category: '',
  inStock: true
})

const filteredProducts = computed(() => {
  if (!search.value) return products.value
  return products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase()) ||
    p.description.toLowerCase().includes(search.value.toLowerCase())
  )
})

const editProduct = (product: Product) => {
  editingProduct.value = product
  Object.assign(productForm, product)
  showProductForm.value = true
}

const closeProductForm = () => {
  showProductForm.value = false
  editingProduct.value = null
  Object.assign(productForm, {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    inStock: true
  })
}

const handleSubmitProduct = async () => {
  loading.value = true
  try {
    // TODO: API call to save/update product
    console.log('Saving product:', productForm)
    await new Promise(resolve => setTimeout(resolve, 1000))
    closeProductForm()
  } catch (err) {
    console.error('Error saving product:', err)
  } finally {
    loading.value = false
  }
}

const deleteProduct = async (productId: string) => {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return
  
  try {
    // TODO: API call to delete product
    console.log('Deleting product:', productId)
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (err) {
    console.error('Error deleting product:', err)
  }
}
</script>
