<template>
  <div class="w-full min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="w-full flex justify-between items-center py-4">
          <div class="w-full flex items-center space-x-4">
            <NuxtLink to="/" class="text-xl font-bold text-primary-600">
              Inovare
            </NuxtLink>
          </div>

          <nav class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">{{ user?.username }}</span>
            <UButton @click="handleLogout" variant="ghost" color="gray">
              Sair
            </UButton>
          </nav>
        </div>
      </div>
    </header>

    <main class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <footer class="bg-white border-t mt-12">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-sm text-gray-600">
          © {{ new Date().getFullYear() }} Inovare - Gerenciador de Chás de
          Lingerie
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth();

const handleLogout = () => {
  logout();
};
</script>
