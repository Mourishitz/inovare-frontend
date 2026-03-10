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
              class="w-full h-64 object-contain rounded-lg"
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
                    class="text-right py-3 px-4 text-sm font-semibold text-gray-700"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in products"
                  :key="product.id"
                  class="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td class="py-3 px-4 text-sm font-medium text-gray-900">
                    <div class="flex items-center gap-2">
                      {{ product.name }}
                      <UBadge
                        v-if="product.is_exclusive"
                        color="info"
                        variant="outline"
                        >Exclusivo</UBadge
                      >
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-600">
                    {{ product.description }}
                  </td>
                  <td class="py-3 px-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <UModal
                        :title="product.name"
                        :close="{
                          color: 'primary',
                          variant: 'outline',
                          class: 'rounded-full',
                        }"
                      >
                        <UButton
                          label="Visualizar Imagem"
                          color="neutral"
                          variant="subtle"
                        />

                        <template #body>
                          <img
                            :src="productImages[product.id]"
                            alt="Imagem do produto"
                            class="w-full h-auto rounded-md mb-4"
                          />
                        </template>
                      </UModal>

                      <UButton
                        label="Editar"
                        color="primary"
                        variant="subtle"
                        icon="i-heroicons-pencil-square"
                        @click="openEditModal(product)"
                      />

                      <UButton
                        label="Excluir"
                        color="error"
                        variant="subtle"
                        icon="i-heroicons-trash"
                        @click="openDeleteModal(product)"
                      />
                    </div>
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

  <!-- Edit Product Modal -->
  <UModal
    v-model:open="editModalOpen"
    title="Editar Produto"
    :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }"
  >
    <template #body>
      <UForm :state="editProduct" @submit="handleEditProduct" class="space-y-5">
        <UFormField label="Nome" name="name" required>
          <UInput
            class="w-full"
            v-model="editProduct.name"
            placeholder="Ex: Sutiã"
            :disabled="editing"
            size="xl"
          />
        </UFormField>

        <UFormField label="Descrição" name="description" required>
          <UTextarea
            class="w-full"
            v-model="editProduct.description"
            placeholder="Descrição do produto"
            :disabled="editing"
            :rows="4"
          />
        </UFormField>

        <UFormField label="Nova Imagem (opcional)" name="image">
          <UFileUpload
            v-model="editSelectedFile"
            accept="image/*"
            :disabled="editing"
          />
        </UFormField>

        <div v-if="editPreviewUrl" class="mt-4">
          <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <img
            :src="editPreviewUrl"
            alt="Preview"
            class="w-full h-64 object-contain rounded-lg"
          />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <UButton
            label="Cancelar"
            color="neutral"
            variant="outline"
            type="button"
            @click="editModalOpen = false"
          />
          <UButton
            label="Salvar Alterações"
            color="primary"
            type="submit"
            :loading="editing"
          />
        </div>
      </UForm>
    </template>
  </UModal>

  <!-- Delete Confirmation Modal -->
  <UModal v-model:open="deleteModalOpen" title="Confirmar Exclusão">
    <template #body>
      <p class="text-gray-700">
        Tem certeza que deseja excluir o produto
        <span class="font-semibold">{{ productToDelete?.name }}</span
        >? Essa ação não pode ser desfeita.
      </p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          label="Cancelar"
          color="neutral"
          variant="outline"
          @click="deleteModalOpen = false"
        />
        <UButton
          label="Excluir"
          color="error"
          :loading="deleting"
          @click="handleDeleteProduct"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

const { apiCall } = useApi();

interface Product {
  id: number;
  name: string;
  description: string;
  is_exclusive: boolean;
  shower_id?: number;
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
const productImages = ref<Record<number, string>>({});
const pagination = ref({
  page: 1,
  page_size: 10,
  total: 0,
  total_pages: 1,
});
const loading = ref(false);
const creating = ref(false);
const deleting = ref(false);
const deleteModalOpen = ref(false);
const productToDelete = ref<Product | null>(null);
const selectedFile = ref<File | null>(null);

const editing = ref(false);
const editModalOpen = ref(false);
const editLoadingCatalog = ref(false);
const editSelectedFile = ref<File | null>(null);
const editProduct = reactive({
  id: 0,
  name: "",
  description: "",
  image_url: "",
  is_exclusive: false,
  catalog_id: null as number | null,
  shower_id: null as number | null,
});

const editPreviewUrl = computed(
  () =>
    editProduct.image_url ||
    (editProduct.id ? productImages.value[editProduct.id] : ""),
);

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

watch(editSelectedFile, (file) => {
  if (!file) {
    editProduct.image_url = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    editProduct.image_url = e.target?.result as string;
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

    // Fetch images in parallel
    const imageResults = await Promise.allSettled(
      response.data.map((p) =>
        apiCall<{ image_url: string }>(`/api/products/${p.id}/image`),
      ),
    );
    imageResults.forEach((result, i) => {
      if (result.status === "fulfilled") {
        productImages.value[response.data[i].id] = result.value.image_url;
      }
    });
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

const openDeleteModal = (product: Product) => {
  productToDelete.value = product;
  deleteModalOpen.value = true;
};

const openEditModal = async (product: Product) => {
  editProduct.id = product.id;
  editProduct.name = product.name;
  editProduct.description = product.description;
  editProduct.is_exclusive = product.is_exclusive;
  editProduct.image_url = "";
  editProduct.catalog_id = null;
  editProduct.shower_id = null;
  editSelectedFile.value = null;
  editModalOpen.value = true;

  if (product.is_exclusive) {
    editLoadingCatalog.value = true;
    try {
      const details = await apiCall<{
        catalog_id?: number | null;
        CatalogID?: number | null;
      }>(`/api/products/${product.id}`);
      const catalogId = details.catalog_id ?? details.CatalogID ?? null;
      editProduct.catalog_id = catalogId;

      if (catalogId) {
        const catalog = await apiCall<{
          shower_id?: number;
          ShowerID?: number;
          showerId?: number;
        }>(`/api/catalogs/${catalogId}`);
        editProduct.shower_id =
          catalog.shower_id ?? catalog.ShowerID ?? catalog.showerId ?? null;
      }
    } catch (err) {
      console.error("Error fetching exclusive product details:", err);
    } finally {
      editLoadingCatalog.value = false;
    }
  }
};

const handleEditProduct = async () => {
  editing.value = true;
  try {
    const body: Record<string, unknown> = {
      name: editProduct.name,
      description: editProduct.description,
    };
    if (editProduct.image_url) {
      body.image_url = editProduct.image_url;
    }

    await apiCall(`/api/products/${editProduct.id}`, {
      method: "PATCH",
      body,
    });

    useToast().add({
      title: "Produto atualizado com sucesso!",
      color: "green",
      icon: "i-heroicons-check-circle",
    });

    editModalOpen.value = false;
    await fetchProducts(pagination.value.page);
  } catch (error: any) {
    console.error("Error updating product:", error);
    useToast().add({
      title: "Erro ao atualizar produto",
      description: error.message || "Tente novamente",
      color: "red",
      icon: "i-heroicons-exclamation-triangle",
    });
  } finally {
    editing.value = false;
  }
};

const handleDeleteProduct = async () => {
  if (!productToDelete.value) return;
  deleting.value = true;
  try {
    await apiCall(`/api/products/${productToDelete.value.id}`, {
      method: "DELETE",
    });

    useToast().add({
      title: "Produto excluído com sucesso!",
      color: "green",
      icon: "i-heroicons-check-circle",
    });

    deleteModalOpen.value = false;
    productToDelete.value = null;
    await fetchProducts(pagination.value.page);
  } catch (error: any) {
    console.error("Error deleting product:", error);
    useToast().add({
      title: "Erro ao excluir produto",
      description: error.message || "Tente novamente",
      color: "red",
      icon: "i-heroicons-exclamation-triangle",
    });
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});
</script>
