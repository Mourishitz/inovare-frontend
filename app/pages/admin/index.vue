<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
      <p class="mt-2 text-gray-600">Visão geral do sistema</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UCard>
        <div class="text-center">
          <p class="text-3xl font-bold text-primary-600">
            {{ stats.totalShowers }}
          </p>
          <p class="text-sm text-gray-600 mt-1">Total de Chás</p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <p class="text-3xl font-bold text-yellow-600">
            {{ stats.pendingReview }}
          </p>
          <p class="text-sm text-gray-600 mt-1">Aguardando Revisão</p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <p class="text-3xl font-bold text-green-600">{{ stats.completed }}</p>
          <p class="text-sm text-gray-600 mt-1">Concluídos</p>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UCard>
        <h2 class="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div class="space-y-3">
          <UButton to="/admin/showers" block variant="soft">
            Ver Todos os Chás
          </UButton>
          <UButton to="/admin/products" block variant="soft">
            Gerenciar Produtos
          </UButton>
        </div>
      </UCard>

      <UCard>
        <h2 class="text-xl font-semibold mb-4">Chás Recentes</h2>
        <div class="space-y-2">
          <RecentShowerCard
            v-for="shower in recentShowers"
            :key="shower.id"
            :shower="shower"
          />
          <p
            v-if="recentShowers.length === 0"
            class="text-gray-500 text-sm text-center py-4"
          >
            Nenhum chá cadastrado
          </p>
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

const { apiCall } = useApi();

const stats = ref({
  totalShowers: 0,
  pendingReview: 0,
  completed: 0,
});

const recentShowers = ref<Shower[]>([]);

interface DashboardData {
  approved_catalogs: number;
  not_approved_catalogs: number;
  recent_showers: Shower[];
  total_showers: number;
}

onMounted(async () => {
  try {
    const data = await apiCall<DashboardData>("/api/admin/dashboard");
    stats.value = {
      totalShowers: data.total_showers,
      pendingReview: data.not_approved_catalogs,
      completed: data.approved_catalogs,
    };
    recentShowers.value = data.recent_showers;
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }
});
</script>
