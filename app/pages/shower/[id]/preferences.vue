<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Preferências do Chá de Lingerie</h1>
      <p class="mt-2 text-gray-600">Defina as preferências para seu chá de lingerie</p>
    </div>

    <UCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <UFormGroup label="Tema" name="theme" required>
          <UInput
            v-model="preferences.theme"
            placeholder="Ex: Romântico, Sensual, Clássico"
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="Orçamento (R$)" name="budget" required>
          <UInput
            v-model.number="preferences.budget"
            type="number"
            placeholder="Ex: 5000"
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="Número de Convidadas" name="guestCount" required>
          <UInput
            v-model.number="preferences.guestCount"
            type="number"
            placeholder="Ex: 50"
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="Pedidos Especiais" name="specialRequests">
          <UTextarea
            v-model="preferences.specialRequests"
            placeholder="Descreva preferências de estilo, tamanhos, cores ou marcas de lingerie..."
            :rows="4"
            :disabled="loading"
          />
        </UFormGroup>

        <div v-if="error" class="text-sm text-red-600">
          {{ error }}
        </div>

        <div class="flex gap-4">
          <UButton
            type="submit"
            :loading="loading"
          >
            Salvar Preferências
          </UButton>
          <UButton
            to="/"
            variant="ghost"
            :disabled="loading"
          >
            Voltar
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { ShowerPreferences } from '~/types'

definePageMeta({
  middleware: ['auth', 'user'],
  layout: 'authenticated'
})

const route = useRoute()
const router = useRouter()
const showerId = route.params.id

const preferences = reactive<ShowerPreferences>({
  theme: '',
  budget: 0,
  guestCount: 0,
  specialRequests: ''
})

const loading = ref(false)
const error = ref('')

// TODO: Load existing preferences if editing

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    // TODO: Replace with actual API call
    console.log('Saving preferences for shower:', showerId, preferences)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    router.push('/')
  } catch (err) {
    error.value = 'Erro ao salvar preferências. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>