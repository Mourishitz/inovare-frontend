<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-50 to-white">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 mb-8">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
        <UButton
          variant="ghost"
          icon="i-heroicons-arrow-left"
          class="mb-4"
          @click="handleBack"
        >
          Voltar
        </UButton>

        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">
              {{ catalog?.name || "Catálogo de Lingerie" }}
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
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mb-4"
        />
        <p class="text-lg text-gray-600">Carregando seu catálogo...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !catalog" class="w-full px-4 py-24">
      <UCard>
        <div class="text-center py-8">
          <div
            class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4"
          >
            <Icon
              name="i-heroicons-exclamation-triangle"
              class="h-8 w-8 text-red-600"
            />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Erro ao carregar catálogo
          </h3>
          <p class="text-red-500 mb-6">{{ error }}</p>
          <UButton to="/" size="lg"> Voltar para Início </UButton>
        </div>
      </UCard>
    </div>

    <!-- Catalog Content -->
    <template v-else-if="catalog">
      <div class="w-full px-4 sm:px-6 lg:px-8 pb-12">
        <!-- Catalog Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <UCard>
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div
                  class="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center"
                >
                  <Icon
                    name="i-heroicons-shopping-bag"
                    class="h-6 w-6 text-pink-600"
                  />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">
                  Total de Produtos
                </p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ catalog.products.length }}
                </p>
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div
                  class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <Icon
                    name="i-heroicons-check-circle"
                    class="h-6 w-6 text-green-600"
                  />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Disponíveis</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ availableCount }}
                </p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Products Grid -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            Produtos do Catálogo
          </h2>

          <div v-if="catalog.products.length === 0" class="text-center py-12">
            <UCard>
              <div class="py-8">
                <Icon
                  name="i-heroicons-inbox"
                  class="mx-auto h-16 w-16 text-gray-400 mb-4"
                />
                <p class="text-gray-500">Nenhum produto adicionado ainda.</p>
              </div>
            </UCard>
          </div>

          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <UCard
              v-for="product in catalog.products"
              :key="product.id"
              class="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <!-- Product Image -->
              <div
                class="relative aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg overflow-hidden mb-4 cursor-pointer"
                @click="openImageModal(product)"
              >
                <img
                  v-if="product.imageUrl"
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="w-full h-full object-contain"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <Icon
                    name="i-heroicons-photo"
                    class="h-16 w-16 text-gray-400"
                  />
                </div>

                <!-- Stock Badge -->
                <div class="absolute top-2 right-2">
                  <UBadge
                    :color="!product.is_bought ? 'green' : 'red'"
                    variant="solid"
                  >
                    {{ !product.is_bought ? "Disponível" : "Esgotado" }}
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
              </div>
            </UCard>
          </div>
        </div>

        <!-- Review Section -->
        <div v-if="catalog.status === 'ready_for_review'" class="mt-12">
          <UCard
            class="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200"
          >
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div
                    class="h-12 w-12 rounded-full bg-pink-200 flex items-center justify-center"
                  >
                    <Icon
                      name="i-heroicons-clipboard-document-check"
                      class="h-6 w-6 text-pink-700"
                    />
                  </div>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">
                    Revisar Catálogo
                  </h3>
                  <p class="text-gray-600">
                    Revise os produtos acima e aprove o catálogo ou solicite
                    alterações adicionando seus comentários abaixo.
                  </p>
                </div>
              </div>

              <!-- Comments list -->
              <div
                v-if="commentsLoading"
                class="text-center py-4 text-gray-400"
              >
                Carregando comentários...
              </div>
              <div
                v-else-if="comments.length > 0"
                class="space-y-3 max-h-72 overflow-y-auto pr-1"
              >
                <div
                  v-for="comment in comments"
                  :key="comment.id"
                  class="flex gap-3"
                >
                  <div
                    class="flex-shrink-0 h-9 w-9 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-bold uppercase text-sm"
                  >
                    {{ comment.author.username.charAt(0) }}
                  </div>
                  <div
                    class="flex-1 bg-white rounded-lg px-4 py-3 border border-pink-100"
                  >
                    <div class="flex items-baseline justify-between gap-2 mb-1">
                      <span class="font-semibold text-sm text-gray-900">{{
                        comment.author.username
                      }}</span>
                      <span class="text-xs text-gray-400">{{
                        formatCommentDate(comment.CreatedAt)
                      }}</span>
                    </div>
                    <p class="text-sm text-gray-700 whitespace-pre-wrap">
                      {{ comment.content }}
                    </p>
                  </div>
                </div>
              </div>

              <form class="space-y-6" @submit.prevent="submitComment">
                <UFormGroup
                  label="Comentários ou Sugestões"
                  name="comments"
                  help="Opcional para aprovar. Para solicitar alterações, adicione um comentário explicando o ajuste desejado."
                >
                  <UTextarea
                    v-model="review.comments"
                    placeholder="Caso queira alterar alguma peça, pedimos que nos informe o número da peça e o motivo da troca, conforme exemplo abaixo:&#10;Trocas:&#10;05 – Lateral da calcinha fina, trocar por uma mais grossa"
                    :rows="4"
                    :disabled="commentLoading"
                    class="w-full"
                  />
                </UFormGroup>

                <div
                  v-if="error || commentError"
                  class="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div class="flex items-center space-x-2">
                    <Icon
                      name="i-heroicons-exclamation-circle"
                      class="h-5 w-5 text-red-600"
                    />
                    <p class="text-sm text-red-700">
                      {{ error || commentError }}
                    </p>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <div
                    class="justify-self-start pt-2 w-6/12 flex justify-start gap-2"
                  >
                    <UButton
                      type="button"
                      :loading="loading"
                      color="green"
                      size="lg"
                      class="flex-1 border border-green-600 bg-green-100 text-green-900 max-w-xs hover:bg-green-600 hover:text-white transition-colors duration-300 cursor-pointer"
                      @click="handleApprove"
                    >
                      <Icon name="i-heroicons-check-circle" class="mr-2" />
                      Aprovar Catálogo
                    </UButton>
                    <UButton
                      type="submit"
                      :loading="commentLoading"
                      :disabled="!review.comments.trim()"
                      color="orange"
                      variant="soft"
                      size="lg"
                      class="flex-1 border border-orange-400 bg-orange-100 text-yellow-900 max-w-xs hover:bg-orange-400 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      <Icon
                        name="i-heroicons-chat-bubble-left-right"
                        class="mr-2"
                      />
                      Solicitar Alterações
                    </UButton>
                  </div>
                  <div
                    class="justify-self-end pt-2 w-6/12 flex justify-end gap-2"
                  >
                    <UButton
                      to="/"
                      color="error"
                      size="lg"
                      class="text-center max-w-xs"
                      :disabled="commentLoading"
                    >
                      Voltar
                    </UButton>
                  </div>
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
                <div
                  class="h-16 w-16 rounded-full bg-green-200 flex items-center justify-center"
                >
                  <Icon
                    name="i-heroicons-check-circle"
                    class="h-10 w-10 text-green-700"
                  />
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-green-900 mb-1">
                    Catálogo Aprovado!
                  </h3>
                  <p class="text-green-700">
                    Seu catálogo foi aprovado e pode ser compartilhado com seus
                    convidados! <br />
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
</template>

<script setup lang="ts">
import type { Catalog } from "~/types";
import { CatalogStatus } from "~/types";

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
  layout: "authenticated",
});

const route = useRoute();
const router = useRouter();
const showerId = route.params.id;
const { apiCall } = useApi();

const handleBack = async () => {
  if (import.meta.client && window.history.length > 1) {
    router.back();
    return;
  }

  await navigateTo("/");
};

const catalog = ref<Catalog | null>(null);

const review = reactive({
  comments: "",
});

const loading = ref(false);
const error = ref("");
const fetchLoading = ref(true);

// Backend response interface
interface BackendCatalogResponse {
  catalog: {
    ID: number;
    approved: boolean;
    url: string;
    package: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  products: Array<{
    ID: number;
    is_bought: boolean;
    product: {
      ID: number;
      name: string;
      description: string;
      images: string[];
    };
  }>;
}

// Computed properties
const availableCount = computed(
  () => catalog.value?.products.filter((p) => !p.is_bought).length || 0,
);

// Image Modal
const imageModalOpen = ref(false);
const imageModalProductId = ref<string | null>(null);
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

const openImageModal = async (product: Catalog['products'][0]) => {
  imageModalProductName.value = product.name;
  imageModalProductId.value = product.id;
  imageModalImages.value = [];
  imageModalIndex.value = 0;
  imageModalZoom.value = 1;
  imageModalOpen.value = true;
  imageModalLoading.value = true;
  
  try {
    const response = await apiCall<{ images: string[] }>(`/api/products/${product.id}/image`);
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

const comments = ref<CatalogComment[]>([]);
const commentsLoading = ref(false);
const commentLoading = ref(false);
const commentError = ref<string | null>(null);

const { formatDateTime: formatCommentDate } = useDate();

const fetchComments = async (catalogId: string) => {
  commentsLoading.value = true;
  try {
    comments.value = await apiCall<CatalogComment[]>(
      `/api/catalogs/${catalogId}/comments`,
    );
  } catch (err) {
    console.error("Error fetching comments:", err);
  } finally {
    commentsLoading.value = false;
  }
};

const submitComment = async () => {
  if (!review.comments.trim() || !catalog.value) return;
  commentLoading.value = true;
  commentError.value = null;
  try {
    const created = await apiCall<CatalogComment>(
      `/api/catalogs/${catalog.value.id}/comments`,
      {
        method: "POST",
        body: { content: review.comments.trim() },
      },
    );
    comments.value.push(created);
    review.comments = "";
  } catch (err: any) {
    commentError.value =
      err?.data?.error || err?.message || "Erro ao enviar comentário";
  } finally {
    commentLoading.value = false;
  }
};

// Fetch catalog on mount
onMounted(async () => {
  try {
    const response = await apiCall<BackendCatalogResponse>(
      `/api/showers/${showerId}/catalog`,
    );

    const catalogId = response.catalog.ID.toString();

    // Transform backend response to frontend format
    catalog.value = {
      id: catalogId,
      showerId: showerId as string,
      name: `Catálogo - ${response.catalog.package}`,
      status: response.catalog.approved
        ? CatalogStatus.APPROVED
        : CatalogStatus.READY_FOR_REVIEW,
      products: response.products.map((item) => ({
        id: item.product.ID.toString(),
        name: item.product.name,
        description: item.product.description,
        imageUrl: item.product.imageUrl || "",
        category: "",
        is_bought: item.is_bought,
      })),
      createdAt: response.catalog.CreatedAt,
      updatedAt: response.catalog.UpdatedAt,
    };

    await fetchComments(catalogId);
  } catch (err) {
    const apiError = err as { data?: { error?: string } };
    error.value = apiError.data?.error || "Erro ao carregar catálogo";
    console.error("Error fetching catalog:", err);
  } finally {
    fetchLoading.value = false;
  }
});

const getStatusColor = (status?: CatalogStatus) => {
  if (!status) return "gray";
  const colors = {
    draft: "gray",
    ready_for_review: "blue",
    approved: "green",
    changes_requested: "yellow",
  };
  return colors[status] || "gray";
};

const getStatusLabel = (status?: CatalogStatus) => {
  if (!status) return "N/A";
  const labels = {
    draft: "Rascunho",
    ready_for_review: "Pronto para Revisão",
    approved: "Aprovado",
    changes_requested: "Alterações Solicitadas",
  };
  return labels[status] || status;
};

const handleApprove = async () => {
  if (!catalog.value) return;

  loading.value = true;
  error.value = "";

  try {
    await apiCall(`/api/catalogs/${catalog.value.id}/approve`, {
      method: "PATCH",
    });
    router.push("/");
  } catch (err) {
    const apiError = err as { data?: { error?: string } };
    error.value = apiError.data?.error || "Erro ao aprovar catálogo.";
    console.error("Error approving catalog:", err);
  } finally {
    loading.value = false;
  }
};

const handleReview = async () => {
  loading.value = true;
  error.value = "";

  try {
    await apiCall(`/api/showers/${showerId}/catalog/approve`, {
      method: "POST",
      body: JSON.stringify({
        approved: false,
        comments: review.comments,
      }),
    });
    router.push("/");
  } catch (err) {
    const apiError = err as { data?: { error?: string } };
    error.value = apiError.data?.error || "Erro ao enviar comentários.";
    console.error("Error requesting changes:", err);
  } finally {
    loading.value = false;
  }
};
</script>
