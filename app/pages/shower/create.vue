<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Criar Novo Chá de Lingerie</h1>
      <p class="mt-2 text-gray-600">Preencha os detalhes do seu chá de lingerie</p>
    </div>

    <UCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <UFormGroup label="Título do Chá" name="title" required>
          <UInput
            v-model="form.title"
            placeholder="Ex: Chá da Maria"
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="Data" name="date" required>
          <UInput
            v-model="form.date"
            type="date"
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="Local" name="location" required>
          <UInput
            v-model="form.location"
            placeholder="Ex: Salão de Festas"
            :disabled="loading"
          />
        </UFormGroup>

        <UFormGroup label="Descrição" name="description">
          <UTextarea
            v-model="form.description"
            placeholder="Descreva os detalhes do evento..."
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
            Criar Chá
          </UButton>
          <UButton
            to="/"
            variant="ghost"
            :disabled="loading"
          >
            Cancelar
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'user'],
  layout: 'authenticated'
})

const router = useRouter()

const form = reactive({
  title: '',
  date: '',
  location: '',
  description: ''
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    // TODO: Replace with actual API call
    console.log('Creating shower:', form)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect to preferences page
    router.push('/shower/new-id/preferences')
  } catch (err) {
    error.value = 'Erro ao criar chá. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>
