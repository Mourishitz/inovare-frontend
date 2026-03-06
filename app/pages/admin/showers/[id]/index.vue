<template>
  <div>
    <div class="mb-8">
      <UButton
        to="/admin/showers"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        Voltar
      </UButton>
      <h1 class="text-3xl font-bold text-gray-900">Detalhes do Chá</h1>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p>Carregando...</p>
    </div>

    <div v-else-if="error" class="py-8">
      <UAlert
        color="red"
        variant="soft"
        title="Erro ao carregar chá"
        :description="error"
      />
    </div>

    <div v-else-if="shower" class="space-y-6">
      <!-- Host Information -->
      <UCard>
        <h2 class="text-xl font-semibold mb-4">Informações da Anfitriã</h2>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">Nome</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ shower.host?.username }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">E-mail</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ shower.host?.email }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Telefone</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ shower.host?.phone_number }}
            </dd>
          </div>
        </dl>
      </UCard>

      <!-- Shower Information -->
      <UCard>
        <h2 class="text-xl font-semibold mb-4">Informações do Chá</h2>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">Data do Chá</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatDate(shower.shower_date) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Data do Casamento</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatDate(shower.wedding_date) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Local</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ shower.location }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">
              Número de Convidados
            </dt>
            <dd class="mt-1 text-sm text-gray-900">{{ shower.guests }}</dd>
          </div>
        </dl>
      </UCard>

      <!-- Preferences Information -->
      <UCard v-if="shower.preferences">
        <h2 class="text-xl font-semibold mb-4">Preferências</h2>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">Estilo</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ shower.preferences.style }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Tamanho</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ shower.preferences.size }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Sutiã Preferido</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ shower.preferences.preferredBra }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">
              Calcinha Preferida
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ shower.preferences.preferredPanties }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Modelo Preferido</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ shower.preferences.preferredModel }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Cores Favoritas</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <span v-if="shower.preferences.favoriteColors?.length">
                {{ shower.preferences.favoriteColors.join(", ") }}
              </span>
              <span v-else class="text-gray-400">Nenhuma</span>
            </dd>
          </div>
          <div v-if="shower.preferences.allowedModels" class="md:col-span-2">
            <dt class="text-sm font-medium text-gray-500">
              Modelos Permitidos
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ shower.preferences.allowedModels }}
            </dd>
          </div>
          <div v-if="shower.preferences.notAllowedModels" class="md:col-span-2">
            <dt class="text-sm font-medium text-gray-500">
              Modelos Não Permitidos
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ shower.preferences.notAllowedModels }}
            </dd>
          </div>
          <div v-if="shower.preferences.notes" class="md:col-span-2">
            <dt class="text-sm font-medium text-gray-500">Observações</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ shower.preferences.notes }}
            </dd>
          </div>
        </dl>
      </UCard>

      <!-- Catalog Information -->
      <UCard v-if="shower.catalog">
        <h2 class="text-xl font-semibold mb-4">Catálogo</h2>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">Pacote</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ shower.catalog.package }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="mt-1">
              <UBadge :color="shower.catalog.approved ? 'green' : 'yellow'">
                {{ shower.catalog.approved ? "Aprovado" : "Pendente" }}
              </UBadge>
            </dd>
          </div>
          <div class="md:col-span-2">
            <dt class="text-sm font-medium text-gray-500">URL</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <a
                :href="shower.catalog.url"
                target="_blank"
                class="text-blue-600 hover:underline"
              >
                {{ shower.catalog.url }}
              </a>
            </dd>
          </div>
        </dl>
      </UCard>

      <!-- Actions -->
      <UCard>
        <h2 class="text-xl font-semibold mb-4">Ações</h2>
        <div class="flex gap-4">
          <UButton
            v-if="shower.preferences && !shower.catalog_id"
            :to="`/admin/showers/${showerId}/catalog/create`"
          >
            Criar Catálogo
          </UButton>
          <UButton
            v-if="shower.catalog_id"
            :to="`/admin/showers/${showerId}/catalog/create`"
            variant="soft"
          >
            Editar Catálogo
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Shower } from "~/types";

definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

useHead({
  title: "Detalhes do Chá - Inovare Admin",
});

const route = useRoute();
const showerId = route.params.id;

const shower = ref<Shower | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const { formatDate } = useDate();

const loadShower = async () => {
  try {
    loading.value = true;
    error.value = null;
    const { apiCall } = useApi();
    const data = await apiCall<Shower>(`/api/showers/${showerId}`);
    shower.value = data;
  } catch (err: any) {
    console.error("Error loading shower:", err);
    error.value = err?.message || "Erro ao carregar chá";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadShower();
});
</script>
