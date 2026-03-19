<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-50 to-white">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 mb-8">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 mb-2">
              {{ hostUsername ? `Chá de ${hostUsername}` : "Catálogo de Lingerie" }}
            </h1>
          </div>
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
          <UButton to="/" size="lg">Voltar para Início</UButton>
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
              <div
                class="relative aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg overflow-hidden mb-4"
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

                <div class="absolute top-2 right-2">
                  <UBadge
                    :color="product.inStock ? 'green' : 'red'"
                    variant="solid"
                  >
                    {{ product.inStock ? "Disponível" : "Adquirido" }}
                  </UBadge>
                </div>
              </div>

              <div class="space-y-2">
                <h3 class="font-semibold text-lg text-gray-900 line-clamp-1">
                  {{ product.name }}
                </h3>
                <p class="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                  {{ product.description }}
                </p>

                <div
                  class="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-3"
                >
                  <p
                    class="text-lg font-bold"
                    :class="
                      product.inStock ? 'text-pink-700' : 'text-gray-500'
                    "
                  >
                    {{ product.inStock ? formatPrice(product.price) : "Adquirido" }}
                  </p>

                  <UButton
                    type="button"
                    size="sm"
                    color="primary"
                    :disabled="!product.inStock"
                    @click="openPurchaseModal(product)"
                  >
                    Comprar
                  </UButton>
                </div>
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
                  :key="comment.ID"
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
                  help="Obrigatório: Adicione um comentário antes de aprovar ou solicitar alterações"
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
                      :disabled="!review.comments.trim()"
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
      </div>
    </template>

    <UModal v-model:open="purchaseModalOpen">
      <template #content>
        <UCard v-if="selectedPurchaseProduct" class="w-full max-w-lg">
          <template #header>
            <h3 class="text-lg font-semibold">Comprar via PIX</h3>
          </template>

          <div class="space-y-4">
            <div class="rounded-lg border border-pink-100 bg-pink-50 p-4">
              <p class="font-semibold text-gray-900">
                {{ selectedPurchaseProduct.name }}
              </p>
              <p class="mt-1 text-sm text-gray-600">
                {{ selectedPurchaseProduct.description }}
              </p>
              <p class="mt-3 text-lg font-bold text-pink-700">
                {{ formatPrice(selectedPurchaseProduct.price) }}
              </p>
            </div>

            <UFormField label="Nome" required>
              <UInput
                v-model="purchaseForm.name"
                placeholder="Seu nome"
                :disabled="purchaseLoading"
              />
            </UFormField>

            <UFormField label="E-mail" required>
              <UInput
                v-model="purchaseForm.email"
                type="email"
                placeholder="voce@email.com"
                :disabled="purchaseLoading"
              />
            </UFormField>

            <UFormField label="Celular" required>
              <UInput
                v-model="purchaseForm.cellphone"
                placeholder="(11) 99999-9999"
                :disabled="purchaseLoading"
              />
            </UFormField>

            <UFormField label="CPF ou CNPJ" required>
              <UInput
                v-model="purchaseForm.taxId"
                placeholder="000.000.000-00"
                :disabled="purchaseLoading"
              />
            </UFormField>

            <UAlert
              v-if="purchaseError"
              color="error"
              variant="soft"
              :description="purchaseError"
            />
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                type="button"
                variant="ghost"
                :disabled="purchaseLoading"
                @click.prevent="closePurchaseModal"
              >
                Cancelar
              </UButton>
              <UButton
                type="button"
                color="primary"
                :loading="purchaseLoading"
                :disabled="!canSubmitPurchase"
                @click.prevent="submitPurchase"
              >
                Continuar com PIX
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { CatalogStatus } from "~/types";
import type { Catalog, Product } from "~/types";

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

interface BackendCatalogResponse {
  catalog: {
    ID: number;
    approved: boolean;
    url: string;
    package: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  host?: {
    username: string;
  };
  products: Array<{
    ID: number;
    price: number;
    is_bought: boolean;
    product: {
      ID: number;
      name: string;
      description: string;
      image_url: string;
    };
  }>;
}

interface PurchaseBillingResponse {
  checkoutUrl: string;
}

definePageMeta({
  layout: "authenticated",
});

const route = useRoute();
const router = useRouter();
const { apiCall } = useApi();

const slug = computed(() => {
  const raw = route.params.slug as string;
  // Extract just the slug portion in case a full URL is somehow passed
  return raw.split("/").pop() || raw;
});

const catalog = ref<Catalog | null>(null);
const hostUsername = ref<string | null>(null);
const review = reactive({ comments: "" });

const loading = ref(false);
const error = ref("");
const fetchLoading = ref(true);

const comments = ref<CatalogComment[]>([]);
const commentsLoading = ref(false);
const commentLoading = ref(false);
const commentError = ref<string | null>(null);
const purchaseModalOpen = ref(false);
const purchaseLoading = ref(false);
const purchaseError = ref<string | null>(null);
const selectedPurchaseProduct = ref<Product | null>(null);
const purchaseForm = reactive({
  name: "",
  email: "",
  cellphone: "",
  taxId: "",
});

const { formatDateTime: formatCommentDate } = useDate();

const availableCount = computed(
  () => catalog.value?.products.filter((p) => p.inStock).length || 0,
);
const canSubmitPurchase = computed(
  () =>
    !!selectedPurchaseProduct.value &&
    !!purchaseForm.name.trim() &&
    !!purchaseForm.email.trim() &&
    !!purchaseForm.cellphone.trim() &&
    !!purchaseForm.taxId.trim(),
);

const formatPrice = (priceInCents: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceInCents / 100);

const loadCatalog = async () => {
  const response = await apiCall<BackendCatalogResponse>(
    `/api/catalogs/url/${slug.value}`,
  );

  const catalogId = response.catalog.ID.toString();

  hostUsername.value = response.host?.username ?? null;

  catalog.value = {
    id: catalogId,
    name: `Catálogo - ${response.catalog.package}`,
    status: response.catalog.approved
      ? CatalogStatus.APPROVED
      : CatalogStatus.READY_FOR_REVIEW,
    products: response.products.map((item) => ({
      id: item.product.ID.toString(),
      name: item.product.name,
      description: item.product.description,
      price: item.price,
      imageUrl: item.product.image_url,
      category: "",
      inStock: !item.is_bought,
    })),
    approved: response.catalog.approved,
    url: response.catalog.url,
    package: response.catalog.package,
    createdAt: response.catalog.CreatedAt,
    updatedAt: response.catalog.UpdatedAt,
  };

  await fetchComments(catalogId);
};

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
      { method: "POST", body: { content: review.comments.trim() } },
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

const handleApprove = async () => {
  if (!catalog.value) return;
  loading.value = true;
  error.value = "";
  try {
    await apiCall(`/api/catalogs/${catalog.value.id}/approve`, {
      method: "POST",
      body: JSON.stringify({
        approved: true,
        comments: review.comments || "",
      }),
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

const openPurchaseModal = (product: Product) => {
  selectedPurchaseProduct.value = product;
  purchaseError.value = null;
  purchaseModalOpen.value = true;
};

const closePurchaseModal = () => {
  if (purchaseLoading.value) return;
  purchaseModalOpen.value = false;
  purchaseError.value = null;
};

const submitPurchase = async () => {
  if (!selectedPurchaseProduct.value || !import.meta.client) return;

  purchaseLoading.value = true;
  purchaseError.value = null;

  try {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("checkout");
    currentUrl.searchParams.delete("productId");

    const response = await $fetch<PurchaseBillingResponse>(
      `/api/public-catalogs/${slug.value}/purchase`,
      {
        method: "POST",
        body: {
          productId: selectedPurchaseProduct.value.id,
          customer: {
            name: purchaseForm.name.trim(),
            email: purchaseForm.email.trim(),
            cellphone: purchaseForm.cellphone.trim(),
            taxId: purchaseForm.taxId.trim(),
          },
          currentUrl: currentUrl.toString(),
        },
      },
    );

    purchaseModalOpen.value = false;
    await navigateTo(response.checkoutUrl, { external: true });
  } catch (err: any) {
    purchaseError.value =
      err?.data?.statusMessage ||
      err?.statusMessage ||
      err?.message ||
      "Erro ao iniciar o pagamento via PIX.";
  } finally {
    purchaseLoading.value = false;
  }
};

onMounted(async () => {
  try {
    await loadCatalog();
  } catch (err) {
    const apiError = err as { data?: { error?: string } };
    error.value = apiError.data?.error || "Erro ao carregar catálogo";
    console.error("Error fetching catalog by URL:", err);
  } finally {
    fetchLoading.value = false;
  }
});

const getStatusColor = (status?: CatalogStatus) => {
  if (!status) return "gray";
  const colors: Record<string, string> = {
    draft: "gray",
    ready_for_review: "blue",
    approved: "green",
    changes_requested: "yellow",
  };
  return colors[status] || "gray";
};

const getStatusLabel = (status?: CatalogStatus) => {
  if (!status) return "N/A";
  const labels: Record<string, string> = {
    draft: "Rascunho",
    ready_for_review: "Pronto para Revisão",
    approved: "Aprovado",
    changes_requested: "Alterações Solicitadas",
  };
  return labels[status] || status;
};
</script>
