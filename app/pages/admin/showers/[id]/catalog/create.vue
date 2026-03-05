<template>
  <div>
    <div class="mb-8">
      <UButton
        :to="`/admin/showers/${showerId}`"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        Voltar
      </UButton>
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEditing ? "Editar" : "Criar" }} Catálogo de Lingerie
      </h1>
      <p class="mt-2 text-gray-600">
        Adicione peças íntimas ao catálogo do chá
      </p>
    </div>

    <div class="space-y-6">
      <UCard>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Peças Selecionadas</h2>

        </div>

        <div
          v-if="selectedProducts.length === 0"
          class="text-center py-8 text-gray-500"
        >
          Nenhuma peça adicionada ao catálogo
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
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
              <p class="text-lg font-bold text-primary-600">
                R$ {{ product.price.toFixed(2) }}
              </p>
            </div>
          </UCard>
        </div>
      </UCard>

      <UCard>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Adicionar Peças</h2>
        </div>
        <UInput
          v-model="searchQuery"
          placeholder="Buscar peças..."
          icon="i-heroicons-magnifying-glass"
          :loading="searchLoading"
          @input="handleSearch"
        />

        <div v-if="searchResults.length > 0" class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard v-for="product in searchResults" :key="product.id">
            <div class="space-y-2">
              <img
                v-if="product.image_url"
                :src="product.image_url"
                :alt="product.name"
                class="w-full h-32 object-cover rounded"
              />
              <h3 class="font-semibold">{{ product.name }}</h3>
              <p class="text-sm text-gray-600">{{ product.description }}</p>
              <UBadge v-if="product.is_exclusive" color="primary" variant="soft">Exclusiva</UBadge>
            </div>
          </UCard>
        </div>

        <p v-else-if="searchQuery && !searchLoading" class="mt-4 text-center text-gray-500 py-4">
          Nenhuma peça encontrada
        </p>
      </UCard>

      <div class="flex gap-4">
        <UButton
          @click="handleFinalize"
          :loading="loading"
          :disabled="selectedProducts.length === 0"
        >
          Finalizar e Enviar para Revisão
        </UButton>
        <UButton
          :to="`/admin/showers/${showerId}`"
          variant="ghost"
          :disabled="loading"
        >
          Cancelar
        </UButton>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types";

interface ProductSearchResult {
  id: number;
  name: string;
  description: string;
  image_url: string;
  is_exclusive: boolean;
}

definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

const route = useRoute();
const router = useRouter();
const showerId = route.params.id;

const catalog = reactive({
  name: "",
  showerId: showerId as string,
});

const selectedProducts = ref<Product[]>([]);
const loading = ref(false);
const isEditing = ref(false);

const searchQuery = ref("");
const searchLoading = ref(false);
const searchResults = ref<ProductSearchResult[]>([]);

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
const { apiCall } = useApi();

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    if (!searchQuery.value.trim()) {
      searchResults.value = [];
      return;
    }
    searchLoading.value = true;
    try {
      searchResults.value = (await apiCall<{ data: ProductSearchResult[] }>(`/api/products/search?q=${encodeURIComponent(searchQuery.value)}`)).data;
    } catch (err) {
      console.error("Error searching products:", err);
    } finally {
      searchLoading.value = false;
    }
  }, 300);
};
const removeProduct = (productId: string) => {
  selectedProducts.value = selectedProducts.value.filter(
    (p) => p.id !== productId,
  );
};

const handleSaveCatalog = async () => {
  loading.value = true;
  try {
    // TODO: API call to save catalog info
    console.log("Saving catalog:", catalog);
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (err) {
    console.error("Error saving catalog:", err);
  } finally {
    loading.value = false;
  }
};

const handleFinalize = async () => {
  loading.value = true;
  try {
    // TODO: API call to finalize catalog
    console.log("Finalizing catalog:", {
      ...catalog,
      products: selectedProducts.value,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(`/admin/showers/${showerId}`);
  } catch (err) {
    console.error("Error finalizing catalog:", err);
  } finally {
    loading.value = false;
  }
};
</script>
