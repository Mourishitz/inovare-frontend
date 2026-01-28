<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/admin" class="text-xl font-bold text-primary-600">
              Inovare Admin
            </NuxtLink>
          </div>
          
          <nav class="flex items-center space-x-6">
            <NuxtLink
              to="/admin"
              class="text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/admin/showers"
              class="text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Chás
            </NuxtLink>
            <NuxtLink
              to="/admin/products"
              class="text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Lingerie
            </NuxtLink>
            
            <div class="flex items-center space-x-3 ml-6 pl-6 border-l">
              <span class="text-sm text-gray-600">{{ user?.username }}</span>
              <UButton
                @click="handleLogout"
                variant="ghost"
                color="gray"
              >
                Sair
              </UButton>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <footer class="bg-white border-t mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-sm text-gray-600">
          © {{ new Date().getFullYear() }} Inovare Admin - Gerenciador de Chás de Lingerie
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

const handleLogout = () => {
  logout()
}
</script>
