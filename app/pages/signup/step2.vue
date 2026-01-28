<template>
  <ClientOnly>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <div class="text-center mb-8 animate-fade-in">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg mb-4">
            <UIcon name="i-heroicons-sparkles" class="w-10 h-10 text-white" />
          </div>
          <h2 class="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Inovare
          </h2>
          <p class="mt-2 text-base text-gray-600 font-medium">
            Continue seu cadastro
          </p>
        </div>
        
        <UCard class="shadow-2xl backdrop-blur-sm bg-white/90 animate-slide-up">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold text-gray-900">Informações do Chá</h3>
                <p class="text-sm text-gray-500 mt-1">Passo 2 de 3 - Detalhes do Evento</p>
              </div>
              <div class="flex gap-1">
                <div class="w-8 h-1.5 rounded-full bg-gray-300"></div>
                <div class="w-8 h-1.5 rounded-full bg-primary"></div>
                <div class="w-8 h-1.5 rounded-full bg-gray-200"></div>
              </div>
            </div>
          </template>

          <UForm :state="formData" @submit="handleNext" class="space-y-4">
            <UFormField label="Número de Convidadas" name="guests" :error="errors.guests || undefined">
              <UInput
                v-model.number="formData.guests"
                type="number"
                placeholder="50"
                :disabled="loading"
                size="xl"
                icon="i-heroicons-user-group"
                min="1"
              />
            </UFormField>

            <UFormField label="Local do Evento" name="location" :error="errors.location || undefined">
              <UInput
                v-model="formData.location"
                type="text"
                placeholder="Rua Exemplo, 123 - São Paulo"
                :disabled="loading"
                size="xl"
                icon="i-heroicons-map-pin"
              />
            </UFormField>

            <UFormField label="Data do Chá de Lingerie" name="showerDate" :error="errors.showerDate || undefined">
              <input
                v-model="formData.showerDate"
                type="datetime-local"
                :disabled="loading"
                :class="[
                  'w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all',
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              />
            </UFormField>

            <UFormField label="Data do Casamento" name="weddingDate" :error="errors.weddingDate || undefined">
              <input
                v-model="formData.weddingDate"
                type="datetime-local"
                :disabled="loading"
                :class="[
                  'w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all',
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              />
            </UFormField>

            <UAlert 
              v-if="generalError" 
              color="red" 
              variant="soft"
              icon="i-heroicons-exclamation-triangle"
              :title="generalError"
              :close-button="{ icon: 'i-heroicons-x-mark', color: 'red', variant: 'link' }"
              @close="generalError = ''"
            />

            <div class="pt-2 flex gap-3">
              <UButton
                type="button"
                block
                variant="outline"
                color="gray"
                size="xl"
                @click="router.push('/signup')"
                :disabled="loading"
              >
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 mr-2" />
                <span class="font-semibold">Voltar</span>
              </UButton>
              
              <UButton
                type="submit"
                block
                :loading="loading"
                size="xl"
                color="primary"
                class="shadow-lg hover:shadow-xl transition-shadow"
              >
                <span class="font-semibold">Próximo</span>
                <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
              </UButton>
            </div>
          </UForm>
        </UCard>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: [],
  ssr: false
})

const router = useRouter()

const formData = reactive({
  guests: null as number | null,
  location: '',
  showerDate: '',
  weddingDate: ''
})

const errors = reactive({
  guests: '',
  location: '',
  showerDate: '',
  weddingDate: ''
})

const loading = ref(false)
const generalError = ref('')

// Convert datetime-local format to ISO 8601 with timezone
const formatDateToISO = (dateTimeLocal: string): string => {
  if (!dateTimeLocal) return ''
  const date = new Date(dateTimeLocal)
  return date.toISOString()
}

const validateForm = (): boolean => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  generalError.value = ''

  // Validate guests
  if (!formData.guests || formData.guests < 1) {
    errors.guests = 'Número de convidadas é obrigatório e deve ser maior que zero'
    isValid = false
  }

  // Validate location
  if (!formData.location.trim()) {
    errors.location = 'Local é obrigatório'
    isValid = false
  } else if (formData.location.trim().length < 5) {
    errors.location = 'Local deve ter pelo menos 5 caracteres'
    isValid = false
  }

  // Validate shower date
  if (!formData.showerDate) {
    errors.showerDate = 'Data do chá de lingerie é obrigatória'
    isValid = false
  } else {
    const showerDate = new Date(formData.showerDate)
    const today = new Date()
    if (showerDate < today) {
      errors.showerDate = 'A data deve ser no futuro'
      isValid = false
    }
  }

  // Validate wedding date
  if (!formData.weddingDate) {
    errors.weddingDate = 'Data do casamento é obrigatória'
    isValid = false
  } else {
    const weddingDate = new Date(formData.weddingDate)
    const today = new Date()
    if (weddingDate < today) {
      errors.weddingDate = 'A data deve ser no futuro'
      isValid = false
    }
    
    // Wedding date should be after or equal to shower date
    if (formData.showerDate) {
      const showerDate = new Date(formData.showerDate)
      if (weddingDate < showerDate) {
        errors.weddingDate = 'Data do casamento deve ser igual ou posterior ao chá'
        isValid = false
      }
    }
  }

  return isValid
}

const handleNext = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Prepare data for backend
    const teaData = {
      guests: formData.guests,
      location: formData.location.trim(),
      shower_date: formatDateToISO(formData.showerDate),
      wedding_date: formatDateToISO(formData.weddingDate)
    }

    // Store step 2 data in session storage
    if (import.meta.client) {
      sessionStorage.setItem('signup-step2', JSON.stringify(teaData))
    }

    useToast().add({
      title: 'Informações salvas!',
      description: 'Continue para o próximo passo',
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })

    // Navigate to step 3
    // router.push('/signup/step3')
    
    // For now, show a message
    useToast().add({
      title: 'Em desenvolvimento',
      description: 'Passo 3 será implementado em breve',
      color: 'blue',
      icon: 'i-heroicons-information-circle'
    })

  } catch (err: any) {
    generalError.value = 'Erro ao processar os dados. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out;
}
</style>
