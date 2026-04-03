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

          <UFormField label="Imagens" name="images" required>
            <UFileUpload
              v-model="selectedFiles"
              accept="image/*"
              :disabled="creating"
              multiple
            />
          </UFormField>

          <div v-if="newProduct.images.length > 0" class="mt-4">
            <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div v-for="(img, index) in newProduct.images" :key="index" class="relative">
                <img
                  :src="img"
                  :alt="`Preview ${index + 1}`"
                  class="w-full h-32 object-contain rounded-lg"
                />
                <UButton
                  color="error"
                  variant="solid"
                  size="xs"
                  class="absolute top-1 right-1"
                  icon="i-heroicons-x-mark"
                  @click="removeNewProductImage(index)"
                />
              </div>
            </div>
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
                      <UButton
                        label="Visualizar Imagem"
                        color="neutral"
                        variant="subtle"
                        @click="openImageModal(product)"
                      />

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
            v-model="editSelectedFiles"
            accept="image/*"
            :disabled="editing"
            multiple
          />
        </UFormField>

        <div v-if="editProduct.images.length > 0" class="mt-4">
          <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div v-for="(img, index) in editProduct.images" :key="index" class="relative">
              <img
                :src="img"
                :alt="`Preview ${index + 1}`"
                class="w-full h-32 object-contain rounded-lg"
              />
              <UButton
                color="error"
                variant="solid"
                size="xs"
                class="absolute top-1 right-1"
                icon="i-heroicons-x-mark"
                @click="removeEditProductImage(index)"
              />
            </div>
          </div>
        </div>

        <UButton
          v-if="editSelectedFiles.length > 0"
          color="secondary"
          variant="outline"
          size="sm"
          class="mt-2"
          @click="addEditProductImages"
        >
          Adicionar imagens selecionadas
        </UButton>

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

  <!-- Image Modal -->
  <UModal v-model:open="imageModalOpen" :title="imageModalProductName">
    <template #content>
      <UCard v-if="!imageModalLoading && imageModalImages.length > 0" class="w-full max-w-3xl">
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="text-lg font-semibold">{{ imageModalProductName }}</h3>
              <p class="text-sm text-gray-500">
                Use o scroll do mouse para aproximar ou afastar a imagem e arraste para navegar
              </p>
            </div>
            <UButton variant="soft" size="sm" icon="i-heroicons-arrow-path" @click="resetImageModalZoom">
              {{ imageModalZoomLabel }}
            </UButton>
          </div>
        </template>

        <div
          ref="imageModalContainer"
          class="max-h-[70vh] overflow-auto rounded bg-gray-50 p-4"
          @wheel.prevent="handleImageModalWheel"
          @mousedown="startImageModalDrag"
          @mousemove="handleImageModalDrag"
          @mouseup="stopImageModalDrag"
          @mouseleave="stopImageModalDrag"
        >
          <img
            :src="imageModalImages[imageModalIndex]"
            :alt="`Imagem ${imageModalIndex + 1}`"
            class="mx-auto h-auto rounded object-contain select-none"
            :style="imageModalImageStyle"
            draggable="false"
          />
        </div>

        <template #footer>
          <div class="border-t border-gray-200 pt-4">
            <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div />
              <div class="flex items-center justify-center gap-3">
                <UButton
                  variant="soft"
                  size="sm"
                  icon="i-heroicons-chevron-left"
                  :disabled="!canGoToPreviousImageModal"
                  @click="showPreviousImageModal"
                />
                <span class="min-w-20 text-center text-sm text-gray-500">
                  {{ imageModalPositionLabel }}
                </span>
                <UButton
                  variant="soft"
                  size="sm"
                  icon="i-heroicons-chevron-right"
                  :disabled="!canGoToNextImageModal"
                  @click="showNextImageModal"
                />
              </div>
              <div />
            </div>
          </div>
        </template>
      </UCard>
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
  images: string[];
  is_exclusive: boolean;
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
const deleting = ref(false);
const deleteModalOpen = ref(false);
const productToDelete = ref<Product | null>(null);
const selectedFiles = ref<File[]>([]);

const imageModalOpen = ref(false);
const imageModalProductId = ref<number | null>(null);
const imageModalLoading = ref(false);
const imageModalImages = ref<string[]>([]);
const imageModalProductName = ref("");
const imageModalIndex = ref(0);
const imageModalZoom = ref(1);
const imageModalContainer = ref<HTMLDivElement | null>(null);
const isImageModalDragging = ref(false);
const imageModalDragState = reactive({ startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

const PREVIEW_ZOOM_MIN = 1;
const PREVIEW_ZOOM_MAX = 4;
const PREVIEW_ZOOM_STEP = 0.25;

const imageModalZoomLabel = computed(() => `${Math.round(imageModalZoom.value * 100)}%`);
const imageModalPositionLabel = computed(() => `${imageModalIndex.value + 1} / ${imageModalImages.value.length}`);
const canGoToPreviousImageModal = computed(() => imageModalIndex.value > 0);
const canGoToNextImageModal = computed(() => imageModalIndex.value < imageModalImages.value.length - 1);

const imageModalImageStyle = computed(() => ({
  transform: `scale(${imageModalZoom.value})`,
  cursor: isImageModalDragging.value ? 'grabbing' : 'grab',
}));

const openImageModal = async (product: Product) => {
  imageModalProductName.value = product.name;
  imageModalProductId.value = product.id;
  imageModalImages.value = [];
  imageModalIndex.value = 0;
  imageModalZoom.value = 1;
  imageModalOpen.value = true;
  imageModalLoading.value = true;
  
  try {
    const response = await apiCall<{ images: string[] }>(`/api/products/${product.id}`);
    imageModalImages.value = response.images;
  } catch (error) {
    console.error("Error fetching product images:", error);
  } finally {
    imageModalLoading.value = false;
  }
};

const showPreviousImageModal = () => {
  if (canGoToPreviousImageModal.value) {
    imageModalIndex.value--;
    imageModalZoom.value = 1;
    if (imageModalContainer.value) {
      imageModalContainer.value.scrollLeft = 0;
      imageModalContainer.value.scrollTop = 0;
    }
  }
};

const showNextImageModal = () => {
  if (canGoToNextImageModal.value) {
    imageModalIndex.value++;
    imageModalZoom.value = 1;
    if (imageModalContainer.value) {
      imageModalContainer.value.scrollLeft = 0;
      imageModalContainer.value.scrollTop = 0;
    }
  }
};

const resetImageModalZoom = () => {
  imageModalZoom.value = 1;
  if (imageModalContainer.value) {
    imageModalContainer.value.scrollLeft = 0;
    imageModalContainer.value.scrollTop = 0;
  }
};

const handleImageModalWheel = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? -PREVIEW_ZOOM_STEP : PREVIEW_ZOOM_STEP;
  const newZoom = Math.max(PREVIEW_ZOOM_MIN, Math.min(PREVIEW_ZOOM_MAX, imageModalZoom.value + delta));
  imageModalZoom.value = newZoom;
};

const startImageModalDrag = (e: MouseEvent) => {
  if (!imageModalContainer.value) return;
  isImageModalDragging.value = true;
  imageModalDragState.startX = e.pageX - imageModalContainer.value.offsetLeft;
  imageModalDragState.startY = e.pageY - imageModalContainer.value.offsetTop;
  imageModalDragState.scrollLeft = imageModalContainer.value.scrollLeft;
  imageModalDragState.scrollTop = imageModalContainer.value.scrollTop;
};

const handleImageModalDrag = (e: MouseEvent) => {
  if (!isImageModalDragging.value || !imageModalContainer.value) return;
  e.preventDefault();
  const x = e.pageX - imageModalContainer.value.offsetLeft;
  const y = e.pageY - imageModalContainer.value.offsetTop;
  const walkX = (x - imageModalDragState.startX) * 1.5;
  const walkY = (y - imageModalDragState.startY) * 1.5;
  imageModalContainer.value.scrollLeft = imageModalDragState.scrollLeft - walkX;
  imageModalContainer.value.scrollTop = imageModalDragState.scrollTop - walkY;
};

const stopImageModalDrag = () => {
  isImageModalDragging.value = false;
};

const editing = ref(false);
const editModalOpen = ref(false);
const editLoadingCatalog = ref(false);
const editSelectedFiles = ref<File[]>([]);
const editProduct = reactive({
  id: 0,
  name: "",
  description: "",
  images: [] as string[],
  is_exclusive: false,
  catalog_id: null as number | null,
  shower_id: null as number | null,
});

const newProduct = reactive({
  name: "",
  description: "",
  images: [] as string[],
});

const resetForm = () => {
  newProduct.name = "";
  newProduct.description = "";
  newProduct.images = [];
  selectedFiles.value = [];
};

watch(selectedFiles, (files) => {
  if (!files || files.length === 0) {
    return;
  }

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && !newProduct.images.includes(e.target.result as string)) {
        newProduct.images.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
});

const removeNewProductImage = (index: number) => {
  newProduct.images.splice(index, 1);
};

const addEditProductImages = () => {
  editSelectedFiles.value.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && !editProduct.images.includes(e.target.result as string)) {
        editProduct.images.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
};

const removeEditProductImage = (index: number) => {
  editProduct.images.splice(index, 1);
};

watch(editSelectedFiles, (files) => {
  if (!files || files.length === 0) {
    return;
  }

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && !editProduct.images.includes(e.target.result as string)) {
        editProduct.images.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
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
        images: newProduct.images,
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
  editProduct.images = product.images || [];
  editProduct.catalog_id = null;
  editProduct.shower_id = null;
  editSelectedFiles.value = [];
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
      images: editProduct.images,
    };

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
