<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Meus Chás de Lingerie</h1>
      <p class="mt-2 text-gray-600">Gerencie seu chá de lingerie</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Carregando...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else-if="showers.length === 0" class="text-center py-12">
      <UCard>
        <p class="text-gray-500">Você ainda não criou nenhum chá.</p>
        <p class="text-sm text-gray-400 mt-2">
          Clique no botão abaixo para começar!
        </p>
        <UButton class="mt-4" color="primary" @click="goToSignupStep2">
          Criar meu chá
        </UButton>
      </UCard>
    </div>

    <div v-else class="space-y-6">
      <UCard v-for="shower in showers" :key="shower.ID">
        <template #header>
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold text-xl">Chá de Lingerie</h3>
              <p class="text-sm text-gray-500 mt-1">
                Anfitriã: {{ shower.host.username }}
              </p>
            </div>
            <UBadge v-if="shower.catalog" :color="shower.catalog.approved ? 'green' : 'yellow'">
              {{
                shower.catalog.approved ? "Aprovado" : "Aguardando Aprovação"
              }}
            </UBadge>
            <UBadge v-else color="gray">
              Sem Catálogo
            </UBadge>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Event Details -->
          <div class="space-y-4">
            <div>
              <h4 class="font-semibold text-gray-700 mb-2">
                Detalhes do Evento
              </h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-start gap-2">
                  <span class="text-gray-500 min-w-[120px]">Convidados:</span>
                  <span class="font-medium">{{ shower.guests }}</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-gray-500 min-w-[120px]">Local:</span>
                  <span class="font-medium">{{ shower.location }}</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-gray-500 min-w-[120px]">Data do Chá:</span>
                  <span class="font-medium">{{
                    formatDate(shower.shower_date)
                  }}</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-gray-500 min-w-[120px]"
                    >Data do Casamento:</span
                  >
                  <span class="font-medium">{{
                    formatDate(shower.wedding_date)
                  }}</span>
                </div>
                <div v-if="shower.catalog" class="flex items-start gap-2">
                  <span class="text-gray-500 min-w-[120px]">Embalagem:</span>
                  <span class="font-medium">{{ shower.catalog.package }}</span>
                </div>
              </div>
            </div>

            <div v-if="shower.catalog?.url" class="space-y-2">
              <UButton
                :to="`/shower/${shower.ID}/catalog`"
                color="primary"
                block
              >
                Ver Catálogo
              </UButton>
              <UButton
                :to="shower.catalog.url"
                target="_blank"
                variant="soft"
                block
              >
                Link Externo do Catálogo
              </UButton>
            </div>
          </div>

          <!-- Preferences -->
          <div v-if="shower.preferences" class="space-y-4">
            <div>
              <h4 class="font-semibold text-gray-700 mb-2">Preferências</h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-start gap-2">
                  <span class="text-gray-500 min-w-[120px]">Estilo:</span>
                  <span class="font-medium">{{
                    shower.preferences.style
                  }}</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-gray-500 min-w-[120px]">Tamanho:</span>
                  <span class="font-medium">{{ shower.preferences.size }}</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-gray-500 min-w-[120px]">Sutiã:</span>
                  <span class="font-medium">{{
                    shower.preferences.preferredBra
                  }}</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-gray-500 min-w-[120px]">Modelo:</span>
                  <span class="font-medium">{{
                    shower.preferences.preferredModel
                  }}</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-gray-500 min-w-[120px]">Calcinha:</span>
                  <span class="font-medium">{{
                    shower.preferences.preferredPanties
                  }}</span>
                </div>
              </div>
            </div>

            <div v-if="shower.preferences?.favoriteColors?.length > 0">
              <h5 class="text-sm font-semibold text-gray-700 mb-2">
                Cores Favoritas
              </h5>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="color in shower.preferences.favoriteColors"
                  :key="color"
                  :style="{
                    backgroundColor: getColorHex(color),
                    color: getTextColor(color),
                  }"
                  class="px-2 py-1 rounded text-xs font-medium"
                >
                  {{ color }}
                </span>
              </div>
            </div>

            <div v-if="shower.preferences?.allowedModels?.length > 0">
              <h5 class="text-sm font-semibold text-gray-700 mb-2">
                Modelos Permitidos
              </h5>
              <div class="flex flex-wrap gap-1 justify-center">
                <UBadge
                  v-for="model in shower.preferences.allowedModels"
                  :key="model"
                  color="primary"
                  variant="soft"
                  size="md"
                >
                  {{ model }}
                </UBadge>
              </div>
            </div>

            <div v-if="shower.preferences?.notes">
              <h5 class="text-sm font-semibold text-gray-700 mb-1">
                Observações
              </h5>
              <p class="text-sm text-gray-600">
                {{ shower.preferences.notes }}
              </p>
            </div>

            <div v-if="shower.preferences?.notAllowedModels">
              <h5 class="text-sm font-semibold text-gray-700 mb-1">
                Modelos Não Permitidos
              </h5>
              <p class="text-sm text-gray-600">
                {{ shower.preferences.notAllowedModels }}
              </p>
            </div>
          </div>

          <div v-else class="space-y-4">
            <UAlert color="yellow" icon="i-heroicons-exclamation-triangle">
              <template #title>
                Preferências não definidas
              </template>
              <template #description>
                Você ainda não definiu as preferências do seu chá de lingerie.
              </template>
              <template #footer>
                <UButton :to="`/shower/${shower.ID}/preferences`" color="yellow" size="sm">
                  Definir Preferências
                </UButton>
              </template>
            </UAlert>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["user"],
  layout: "authenticated",
});

const config = useRuntimeConfig();

interface ShowerResponse {
  ID: number;
  guests: number;
  shower_date: string;
  wedding_date: string;
  location: string;
  host: {
    username: string;
    email: string;
  };
  catalog: {
    approved: boolean;
    url: string;
    package: string;
  } | null;
  preferences: {
    style: string;
    favoriteColors: string[];
    preferredBra: string;
    preferredModel: string;
    preferredPanties: string;
    size: string;
    allowedModels: string[];
    notAllowedModels?: string;
    notes?: string;
  } | null;
}

const { token } = useAuth();
const router = useRouter();
const showers = ref<ShowerResponse[]>([]);
const loading = ref(true);
const error = ref("");

const { formatDate } = useDate();

const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    Branco: "#FFFFFF",
    Preto: "#000000",
    Vermelho: "#DC2626",
    Rosa: "#EC4899",
    "Rosê (Rosa Claro)": "#FBCFE8",
    Pink: "#EC4899",
    Roxo: "#9333EA",
    Lilás: "#C084FC",
    Azul: "#3B82F6",
    Verde: "#10B981",
    Amarelo: "#EAB308",
    Laranja: "#F97316",
    Marrom: "#92400E",
    Nude: "#F5E6D3",
  };
  return colorMap[colorName] || "#E5E7EB";
};

const getTextColor = (colorName: string): string => {
  const darkText = [
    "Branco",
    "Rosê (Rosa Claro)",
    "Rosa",
    "Pink",
    "Lilás",
    "Amarelo",
    "Nude",
  ];
  return darkText.includes(colorName) ? "#1F2937" : "#FFFFFF";
};

const goToSignupStep2 = () => {
  sessionStorage.setItem("signup-current-step", "2");
  router.push("/signup");
};

// Fetch showers on mount
onMounted(async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/api/showers/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao carregar chás de lingerie");
    }

    const data = await response.json()
    console.log("API Response:", data)
    showers.value = data.data || []
  } catch (err) {
    const error_obj = err as Error
    error.value = error_obj.message || 'Erro ao carregar dados'
    console.error("Error fetching showers:", err)
  } finally {
    loading.value = false;
  }
});
</script>
