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
            <div class="flex gap-4">
              <button
                v-if="product.imageUrl"
                type="button"
                class="w-24 h-24 shrink-0 cursor-zoom-in self-start"
                @click="openImagePreview(product.name, product.imageUrl)"
              >
                <img
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="w-full h-full object-contain rounded transition hover:scale-[1.02]"
                />
              </button>

              <div class="min-w-0 flex-1 space-y-2">
                <div class="flex justify-between items-start gap-2">
                  <h3 class="font-semibold">{{ product.name }}</h3>
                  <UButton
                    @click="openRemoveModal(product)"
                    icon="i-heroicons-x-mark"
                    size="xs"
                    color="red"
                    variant="ghost"
                    class="cursor-pointer"
                  />
                </div>
                <p class="text-sm text-gray-600">{{ product.description }}</p>
                <p class="text-lg font-bold text-primary-600">
                  R$ {{ (product.price / 100).toFixed(2).replace(".", ",") }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </UCard>

      <UCard>
        <div class="flex justify-start gap-4 items-center mb-4">
          <h2 class="text-xl font-semibold">Adicionar Peças</h2>
          <UButton
            size="sm"
            variant="soft"
            icon="i-heroicons-plus"
            @click="openCreateProductModal"
            class="cursor-pointer"
          >
            Cadastrar Produto Exclusivo
          </UButton>
        </div>
        <UInput
          v-model="searchQuery"
          placeholder="Buscar peças..."
          icon="i-heroicons-magnifying-glass"
          :loading="searchLoading"
          @input="handleSearch"
        />

        <div
          v-if="searchResults.length > 0"
          class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <UCard
            className="w-10/12 border border-gray-300 rounded hover:shadow-lg transition"
            v-for="product in searchResults"
            :key="product.id"
          >
            <div class="space-y-2">
              <button
                v-if="product.image_url"
                type="button"
                class="block w-full cursor-zoom-in"
                @click="openImagePreview(product.name, product.image_url)"
              >
                <img
                  :src="product.image_url"
                  :alt="product.name"
                  class="w-full h-32 object-contain rounded transition hover:scale-[1.02]"
                />
              </button>
              <h3 class="font-semibold">{{ product.name }}</h3>
              <p class="text-sm text-gray-600">{{ product.description }}</p>
              <div class="flex justify-between items-center">
                <UButton
                  @click="openAddModal(product)"
                  size="sm"
                  color="primary"
                  :disabled="
                    selectedProducts.some((p) => p.id === String(product.id))
                  "
                >
                  Adicionar
                </UButton>
                <div class="flex gap-1">
                  <UBadge
                    v-if="
                      selectedProducts.some((p) => p.id === String(product.id))
                    "
                    variant="outline"
                    color="error"
                    >No catálogo</UBadge
                  >
                </div>
              </div>
              <UBadge v-if="product.is_exclusive" color="info" variant="soft"
                >Produto Exclusivo</UBadge
              >
            </div>
          </UCard>
        </div>

        <p
          v-else-if="searchQuery && !searchLoading"
          class="mt-4 text-center text-gray-500 py-4"
        >
          Nenhuma peça encontrada
        </p>
      </UCard>

      <!-- Comments Section -->
      <UCard v-if="catalogId">
        <template #header>
          <div class="flex items-center gap-3">
            <Icon name="i-heroicons-chat-bubble-left-ellipsis" class="h-5 w-5 text-gray-500" />
            <h2 class="text-xl font-semibold">Comentários da Noiva</h2>
          </div>
        </template>

        <div v-if="commentsLoading" class="text-center py-6 text-gray-400">
          Carregando comentários...
        </div>

        <div v-else-if="comments.length === 0" class="text-center py-6 text-gray-400">
          Nenhum comentário ainda.
        </div>

        <div v-else class="space-y-3 max-h-80 overflow-y-auto pr-1">
          <div v-for="comment in comments" :key="comment.ID" class="flex gap-3">
            <div class="flex-shrink-0 h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold uppercase text-sm">
              {{ comment.author.username.charAt(0) }}
            </div>
            <div class="flex-1 bg-gray-50 rounded-lg px-4 py-3">
              <div class="flex items-baseline justify-between gap-2 mb-1">
                <span class="font-semibold text-sm text-gray-900">{{ comment.author.username }}</span>
                <span class="text-xs text-gray-400">{{ formatDateTime(comment.CreatedAt) }}</span>
              </div>
              <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </UCard>

      <div class="flex gap-4">
        <UButton
          @click="handleFinalize"
          :loading="loading"
          :disabled="selectedProducts.length === 0"
        >
          Finalizar e Enviar para Revisão
        </UButton>
      </div>
    </div>

    <UModal v-model:open="isModalOpen">
      <template #content>
        <UCard v-if="modalProduct">
          <template #header>
            <h3 class="text-lg font-semibold">Adicionar Peça ao Catálogo</h3>
          </template>

          <div class="space-y-4">
            <img
              v-if="modalProduct.image_url"
              :src="modalProduct.image_url"
              :alt="modalProduct.name"
              class="w-full h-48 object-contain rounded"
            />
            <div>
              <p class="font-semibold text-lg">{{ modalProduct.name }}</p>
              <UBadge
                v-if="modalProduct.is_exclusive"
                color="primary"
                variant="soft"
                class="mt-1"
                >Exclusiva</UBadge
              >
            </div>
            <p class="text-sm text-gray-600">{{ modalProduct.description }}</p>
            <UFormField label="Preço (R$)" required>
              <UInput
                :model-value="modalPriceDisplay"
                inputmode="numeric"
                placeholder="0,00"
                @input="handlePriceInput"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="space-y-3">
              <UAlert
                v-if="modalError"
                color="red"
                variant="soft"
                :description="modalError"
              />
              <div class="flex justify-end gap-2">
                <UButton
                  variant="ghost"
                  :disabled="modalLoading"
                  @click="isModalOpen = false"
                  >Cancelar</UButton
                >
                <UButton
                  color="primary"
                  :disabled="modalPrice === 0 || !catalogId"
                  :loading="modalLoading"
                  @click="confirmAdd"
                  >Confirmar</UButton
                >
              </div>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <UModal v-model:open="isRemoveModalOpen">
      <template #content>
        <UCard v-if="productToRemove">
          <template #header>
            <h3 class="text-lg font-semibold">Remover Peça do Catálogo</h3>
          </template>

          <p class="text-gray-700">
            Tem certeza que deseja remover
            <span class="font-semibold">{{ productToRemove.name }}</span> do
            catálogo?
          </p>

          <template #footer>
            <div class="space-y-3">
              <UAlert
                v-if="removeError"
                color="error"
                variant="soft"
                :description="removeError"
              />
              <div class="flex justify-end gap-2">
                <UButton
                  variant="ghost"
                  :disabled="removeLoading"
                  @click="isRemoveModalOpen = false"
                  >Cancelar</UButton
                >
                <UButton
                  color="error"
                  :loading="removeLoading"
                  @click="confirmRemove"
                  >Remover</UButton
                >
              </div>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <UModal v-model:open="isCreateProductModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Cadastrar Produto Exclusivo</h3>
          </template>

          <div class="space-y-4">
            <UFormField label="Nome" required>
              <UInput v-model="newProduct.name" placeholder="Nome do produto" />
            </UFormField>
            <UFormField label="Descrição" required>
              <UTextarea
                v-model="newProduct.description"
                placeholder="Descrição do produto"
                :rows="3"
              />
            </UFormField>
            <UFormField label="Imagem">
              <div class="space-y-2">
                <UInput
                  type="file"
                  accept="image/*"
                  @change="handleProductImageUpload"
                />
                <img
                  v-if="newProduct.image_url"
                  :src="newProduct.image_url"
                  alt="Preview"
                  class="w-full h-40 object-contain rounded"
                />
              </div>
            </UFormField>
            <UFormField label="Preço (R$)" required>
              <UInput
                :model-value="newProductPriceDisplay"
                inputmode="numeric"
                placeholder="0,00"
                @input="handleNewProductPriceInput"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="space-y-3">
              <UAlert
                v-if="createProductError"
                color="red"
                variant="soft"
                :description="createProductError"
              />
              <div class="flex justify-end gap-2">
                <UButton
                  variant="ghost"
                  :disabled="createProductLoading"
                  @click="isCreateProductModalOpen = false"
                  >Cancelar</UButton
                >
                <UButton
                  color="primary"
                  :loading="createProductLoading"
                  :disabled="
                    !newProduct.name ||
                    !newProduct.description ||
                    newProductPrice === 0
                  "
                  @click="confirmCreateProduct"
                  >Cadastrar</UButton
                >
              </div>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <UModal v-model:open="isImagePreviewOpen">
      <template #content>
        <UCard v-if="previewImageUrl" class="w-full max-w-3xl">
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <div>
                <h3 class="text-lg font-semibold">{{ previewImageName }}</h3>
                <p class="text-sm text-gray-500">
                  Use o scroll do mouse para aproximar ou afastar a imagem e
                  arraste para navegar
                </p>
              </div>

              <UButton
                variant="soft"
                size="sm"
                icon="i-heroicons-arrow-path"
                @click="resetImageZoom"
              >
                {{ previewZoomLabel }}
              </UButton>
            </div>
          </template>

          <div
            ref="previewContainer"
            class="max-h-[70vh] overflow-auto rounded bg-gray-50 p-4"
            :class="previewContainerCursor"
            @wheel.prevent="handlePreviewWheel"
            @mousedown="startPreviewDrag"
            @mousemove="handlePreviewDrag"
            @mouseup="stopPreviewDrag"
            @mouseleave="stopPreviewDrag"
          >
            <img
              :src="previewImageUrl"
              :alt="previewImageName"
              class="mx-auto h-auto rounded object-contain select-none"
              :style="previewImageStyle"
              draggable="false"
            />
          </div>
        </UCard>
      </template>
    </UModal>
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

interface CatalogProduct {
  ID: number;
  price: number;
  is_bought: boolean;
  catalog_id: number;
  product_id: number;
  product: {
    ID: number;
    name: string;
    description: string;
    image_url: string;
    is_exclusive: boolean;
  };
}

interface CatalogComment {
  ID: number;
  content: string;
  author_id: number;
  author: {
    id: number;
    username: string;
    email: string;
    phone_number: string;
    role: number;
  };
  catalog_id: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
}

definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

const route = useRoute();
const router = useRouter();
const showerId = route.params.id;
const { apiCall } = useApi();
const { formatDateTime } = useDate();

const comments = ref<CatalogComment[]>([]);
const commentsLoading = ref(false);

const fetchComments = async (id: number) => {
  commentsLoading.value = true;
  try {
    comments.value = await apiCall<CatalogComment[]>(`/api/catalogs/${id}/comments`);
  } catch (err) {
    console.error("Error fetching comments:", err);
  } finally {
    commentsLoading.value = false;
  }
};

const catalogId = ref<number | null>(null);

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

const isModalOpen = ref(false);
const modalProduct = ref<ProductSearchResult | null>(null);
const modalPrice = ref(0); // in cents (integer sent to backend)
const modalPriceDisplay = ref("0,00");
const modalLoading = ref(false);
const modalError = ref<string | null>(null);

const handlePriceInput = (e: Event) => {
  const digits = (e.target as HTMLInputElement).value.replace(/\D/g, "");
  const cents = parseInt(digits || "0", 10);
  modalPrice.value = cents;
  modalPriceDisplay.value = (cents / 100).toFixed(2).replace(".", ",");
};

const openAddModal = (product: ProductSearchResult) => {
  modalProduct.value = product;
  modalPrice.value = 0;
  modalPriceDisplay.value = "0,00";
  modalError.value = null;
  isModalOpen.value = true;
};

const confirmAdd = async () => {
  if (!modalProduct.value || modalPrice.value === 0 || !catalogId.value) return;
  modalLoading.value = true;
  modalError.value = null;
  try {
    await apiCall(`/api/catalogs/${catalogId.value}/attach-product`, {
      method: "POST",
      body: {
        product_id: modalProduct.value.id,
        Price: modalPrice.value,
      },
    });
    selectedProducts.value.push({
      id: String(modalProduct.value.id),
      name: modalProduct.value.name,
      description: modalProduct.value.description,
      price: modalPrice.value,
      imageUrl: modalProduct.value.image_url,
      category: "",
      inStock: true,
    });
    isModalOpen.value = false;
  } catch (err: any) {
    console.error("Error attaching product:", err);
    modalError.value = err?.message || "Erro ao adicionar peça ao catálogo";
  } finally {
    modalLoading.value = false;
  }
};

const isRemoveModalOpen = ref(false);
const productToRemove = ref<Product | null>(null);
const removeLoading = ref(false);
const removeError = ref<string | null>(null);

const openRemoveModal = (product: Product) => {
  productToRemove.value = product;
  removeError.value = null;
  isRemoveModalOpen.value = true;
};

const confirmRemove = async () => {
  if (!productToRemove.value || !catalogId.value) return;
  removeLoading.value = true;
  removeError.value = null;
  try {
    await apiCall(
      `/api/catalogs/${catalogId.value}/detach-product/${productToRemove.value.id}`,
      {
        method: "DELETE",
      },
    );
    selectedProducts.value = selectedProducts.value.filter(
      (p) => p.id !== productToRemove.value!.id,
    );
    isRemoveModalOpen.value = false;
  } catch (err: any) {
    console.error("Error detaching product:", err);
    removeError.value = err?.message || "Erro ao remover peça do catálogo";
  } finally {
    removeLoading.value = false;
  }
};

const isCreateProductModalOpen = ref(false);
const createProductLoading = ref(false);
const createProductError = ref<string | null>(null);
const newProduct = reactive({ name: "", description: "", image_url: "" });
const newProductPrice = ref(0);
const newProductPriceDisplay = ref("0,00");
const isImagePreviewOpen = ref(false);
const previewImageName = ref("");
const previewImageUrl = ref("");
const previewContainer = ref<HTMLDivElement | null>(null);
const previewZoom = ref(1);
const isPreviewDragging = ref(false);
const previewDragState = reactive({
  startX: 0,
  startY: 0,
  scrollLeft: 0,
  scrollTop: 0,
});
const PREVIEW_ZOOM_MIN = 1;
const PREVIEW_ZOOM_MAX = 4;
const PREVIEW_ZOOM_STEP = 0.25;

const previewImageStyle = computed(() => ({
  width: `${previewZoom.value * 100}%`,
  maxWidth: "none",
}));

const previewZoomLabel = computed(
  () => `${Math.round(previewZoom.value * 100)}%`,
);

const previewContainerCursor = computed(() => {
  if (previewZoom.value <= PREVIEW_ZOOM_MIN) return "cursor-zoom-in";
  return isPreviewDragging.value ? "cursor-grabbing" : "cursor-grab";
});

const resetImageZoom = () => {
  previewZoom.value = PREVIEW_ZOOM_MIN;
  if (previewContainer.value) {
    previewContainer.value.scrollLeft = 0;
    previewContainer.value.scrollTop = 0;
  }
  isPreviewDragging.value = false;
};

const handlePreviewWheel = (event: WheelEvent) => {
  const direction = event.deltaY < 0 ? 1 : -1;
  const nextZoom = previewZoom.value + direction * PREVIEW_ZOOM_STEP;
  previewZoom.value = Math.min(
    PREVIEW_ZOOM_MAX,
    Math.max(PREVIEW_ZOOM_MIN, Number(nextZoom.toFixed(2))),
  );
};

const startPreviewDrag = (event: MouseEvent) => {
  if (!previewContainer.value || previewZoom.value <= PREVIEW_ZOOM_MIN) return;
  isPreviewDragging.value = true;
  previewDragState.startX = event.clientX;
  previewDragState.startY = event.clientY;
  previewDragState.scrollLeft = previewContainer.value.scrollLeft;
  previewDragState.scrollTop = previewContainer.value.scrollTop;
};

const handlePreviewDrag = (event: MouseEvent) => {
  if (!previewContainer.value || !isPreviewDragging.value) return;
  event.preventDefault();
  const deltaX = event.clientX - previewDragState.startX;
  const deltaY = event.clientY - previewDragState.startY;
  previewContainer.value.scrollLeft = previewDragState.scrollLeft - deltaX;
  previewContainer.value.scrollTop = previewDragState.scrollTop - deltaY;
};

const stopPreviewDrag = () => {
  isPreviewDragging.value = false;
};

const openImagePreview = (name: string, imageUrl: string) => {
  previewImageName.value = name;
  previewImageUrl.value = imageUrl;
  resetImageZoom();
  isImagePreviewOpen.value = true;
};

watch(isImagePreviewOpen, (isOpen) => {
  if (!isOpen) {
    resetImageZoom();
  }
});

const openCreateProductModal = () => {
  newProduct.name = "";
  newProduct.description = "";
  newProduct.image_url = "";
  newProductPrice.value = 0;
  newProductPriceDisplay.value = "0,00";
  createProductError.value = null;
  isCreateProductModalOpen.value = true;
};

const handleProductImageUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    newProduct.image_url = reader.result as string;
  };
  reader.readAsDataURL(file);
};

const handleNewProductPriceInput = (e: Event) => {
  const digits = (e.target as HTMLInputElement).value.replace(/\D/g, "");
  const cents = parseInt(digits || "0", 10);
  newProductPrice.value = cents;
  newProductPriceDisplay.value = (cents / 100).toFixed(2).replace(".", ",");
};

const confirmCreateProduct = async () => {
  if (!newProduct.name || !newProduct.description) return;
  createProductLoading.value = true;
  createProductError.value = null;
  try {
    await apiCall(`/api/catalogs/${catalogId.value}/exclusive-products`, {
      method: "POST",
      body: {
        name: newProduct.name,
        description: newProduct.description,
        image_url: newProduct.image_url,
        Price: newProductPrice.value,
      },
    });
    const catalogProducts = await apiCall<CatalogProduct[]>(
      `/api/catalogs/${catalogId.value}/products`,
    );
    selectedProducts.value = catalogProducts.map((cp) => ({
      id: String(cp.product_id),
      name: cp.product.name,
      description: cp.product.description,
      price: cp.price,
      imageUrl: cp.product.image_url,
      category: "",
      inStock: true,
    }));
    isCreateProductModalOpen.value = false;
  } catch (err: any) {
    console.error("Error creating product:", err);
    createProductError.value = err?.message || "Erro ao cadastrar produto";
  } finally {
    createProductLoading.value = false;
  }
};

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    if (!searchQuery.value.trim()) {
      searchResults.value = [];
      return;
    }
    searchLoading.value = true;
    try {
      searchResults.value = (
        await apiCall<{ data: ProductSearchResult[] }>(
          `/api/products/search?q=${encodeURIComponent(searchQuery.value)}${catalogId.value ? `&catalog_id=${catalogId.value}` : ""}`,
        )
      ).data;
    } catch (err) {
      console.error("Error searching products:", err);
    } finally {
      searchLoading.value = false;
    }
  }, 300);
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

onMounted(async () => {
  try {
    const shower = await apiCall<{ catalog_id: number | null }>(
      `/api/showers/${showerId}`,
    );
    if (shower.catalog_id) {
      catalogId.value = shower.catalog_id;
      isEditing.value = true;

      const catalogProducts = await apiCall<CatalogProduct[]>(
        `/api/catalogs/${shower.catalog_id}/products`,
      );
      selectedProducts.value = catalogProducts.map((cp) => ({
        id: String(cp.product_id),
        name: cp.product.name,
        description: cp.product.description,
        price: cp.price,
        imageUrl: cp.product.image_url,
        category: "",
        inStock: true,
      }));

      await fetchComments(shower.catalog_id);
    }
  } catch (err) {
    console.error("Error loading shower:", err);
  }
});
</script>
