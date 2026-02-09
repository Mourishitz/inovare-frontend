<template>
  <div class="flex flex-col gap-12 py-8 justify-center items-center w-full">
    <!-- Create Product Form -->
    <div class="mb-8 w-3/12">
      <div class="mb-6">
        <h1 class="text-xl font-bold text-gray-900">Adicionar Produto</h1>
        <p class="mt-2 text-gray-600">Cadastre uma nova peça de lingerie</p>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <UForm
          :state="newProduct"
          @submit="handleCreateProduct"
          class="space-y-5"
        >
          <UFormField label="Nome" name="name" required>
            <UInput
              class="w-full"
              v-model="newProduct.name"
              placeholder="Ex: Sutiã"
              :disabled="creating"
              size="xl"
            />
          </UFormField>

          <UFormField label="Descrição" name="description" required>
            <UTextarea
              class="w-full"
              v-model="newProduct.description"
              placeholder="Descrição do produto"
              :disabled="creating"
              :rows="4"
            />
          </UFormField>

          <UFormField label="Imagem" name="image" required>
            <UFileUpload
              v-model="selectedFile"
              accept="image/*"
              :disabled="creating"
            />
          </UFormField>

          <div v-if="newProduct.image_url" class="mt-4">
            <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <img
              :src="newProduct.image_url"
              alt="Preview"
              class="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div class="pt-4">
            <UButton
              type="submit"
              color="primary"
              size="xl"
              block
              :loading="creating"
            >
              Criar Produto
            </UButton>
          </div>
        </UForm>
      </div>
    </div>

    <!-- Products List -->
    <div class="w-full">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-900">Produtos Cadastrados</h2>
        <p class="mt-2 text-gray-600">Lista de peças íntimas disponíveis</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Carregando produtos...</p>
      </div>

      <div v-else-if="products.length === 0" class="text-center py-12">
        <UCard>
          <p class="text-gray-500">Nenhum produto cadastrado ainda</p>
        </UCard>
      </div>

      <div v-else>
        <UCard>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th
                    class="text-left py-3 px-4 text-sm font-semibold text-gray-700"
                  >
                    Nome
                  </th>
                  <th
                    class="text-left py-3 px-4 text-sm font-semibold text-gray-700"
                  >
                    Descrição
                  </th>
                  <th
                    class="text-center py-3 px-4 text-sm font-semibold text-gray-700"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in products"
                  :key="product.ID"
                  class="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td class="py-3 px-4 text-sm font-medium text-gray-900">
                    {{ product.name }}
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-600">
                    {{ product.description }}
                  </td>
                  <td class="py-3 px-4 text-center">
                    <UModal
                      :title="product.name"
                      :close="{
                        color: 'primary',
                        variant: 'outline',
                        class: 'rounded-full',
                      }"
                    >
                      <UButton label="Open" color="neutral" variant="subtle" />

                      <template #body>
                        <img
                          :src="product.image_url"
                          alt="Imagem do produto"
                          class="w-full h-auto rounded-md mb-4"
                        />
                      </template>
                    </UModal>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <template #footer>
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-600">
                Mostrando {{ products.length }} de
                {{ pagination.total }} produtos
              </div>

              <div class="flex gap-2">
                <UButton
                  @click="goToPage(pagination.page - 1)"
                  :disabled="pagination.page === 1"
                  variant="outline"
                  size="sm"
                  icon="i-heroicons-chevron-left"
                >
                  Anterior
                </UButton>

                <div class="flex items-center gap-2 px-3">
                  <span class="text-sm text-gray-600">
                    Página {{ pagination.page }} de {{ pagination.total_pages }}
                  </span>
                </div>

                <UButton
                  @click="goToPage(pagination.page + 1)"
                  :disabled="pagination.page === pagination.total_pages"
                  variant="outline"
                  size="sm"
                  icon-right="i-heroicons-chevron-right"
                >
                  Próxima
                </UButton>
              </div>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

const { apiCall } = useApi();

interface Product {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  name: string;
  description: string;
  image_url: string;
}

interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

const products = ref<Product[]>([]);
const pagination = ref({
  page: 1,
  page_size: 10,
  total: 0,
  total_pages: 1,
});
const loading = ref(false);
const creating = ref(false);
const selectedFile = ref<File | null>(null);

const newProduct = reactive({
  name: "",
  description: "",
  image_url: "",
});

const resetForm = () => {
  newProduct.name = "";
  newProduct.description = "";
  newProduct.image_url = "";
  selectedFile.value = null;
};

// Watch for file changes and convert to base64
watch(selectedFile, (file) => {
  if (!file) {
    newProduct.image_url = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    newProduct.image_url = e.target?.result as string;
  };
  reader.readAsDataURL(file);
});

const fetchProducts = async (page: number = 1) => {
  loading.value = true;
  try {
    const response = await apiCall<ProductsResponse>(
      `/api/products?page=${page}&page_size=10`,
    );
    products.value = response.data;
    pagination.value = response.pagination;
  } catch (error) {
    console.error("Error fetching products:", error);
    useToast().add({
      title: "Erro ao carregar produtos",
      color: "red",
      icon: "i-heroicons-exclamation-triangle",
    });
  } finally {
    loading.value = false;
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    fetchProducts(page);
  }
};

const handleCreateProduct = async () => {
  creating.value = true;
  try {
    await apiCall("/api/products", {
      method: "POST",
      body: {
        name: newProduct.name,
        description: newProduct.description,
        image_url: newProduct.image_url,
      },
    });

    useToast().add({
      title: "Produto criado com sucesso!",
      color: "green",
      icon: "i-heroicons-check-circle",
    });

    resetForm();
    await fetchProducts(pagination.value.page);
  } catch (error: any) {
    console.error("Error creating product:", error);
    useToast().add({
      title: "Erro ao criar produto",
      description: error.message || "Tente novamente",
      color: "red",
      icon: "i-heroicons-exclamation-triangle",
    });
  } finally {
    creating.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});
</script>
