<template>
  <ClientOnly>
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-lg w-full">
        <div class="text-center mb-8 animate-fade-in">
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg mb-4"
          >
            <UIcon name="i-heroicons-sparkles" class="w-10 h-10 text-white" />
          </div>
          <h2
            class="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
          >
            Inovare
          </h2>
          <p class="mt-2 text-base text-gray-600 font-medium">
            {{ currentStep === 1 ? "Crie sua conta" : "Continue seu cadastro" }}
          </p>
        </div>

        <UCard class="shadow-2xl backdrop-blur-sm bg-white/90 animate-slide-up">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold text-gray-900">
                  {{ stepConfig.title }}
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  {{ stepConfig.subtitle }}
                </p>
              </div>
              <div class="flex gap-1">
                <div
                  v-for="step in 4"
                  :key="step"
                  :class="[
                    'w-8 h-1.5 rounded-full transition-colors',
                    step === currentStep
                      ? 'bg-primary'
                      : step < currentStep
                        ? 'bg-gray-300'
                        : 'bg-gray-200',
                  ]"
                ></div>
              </div>
            </div>
          </template>

          <UForm
            :state="currentFormData"
            @submit="handleNext"
            class="space-y-4"
          >
            <!-- Step 1: Basic Information -->
            <template v-if="currentStep === 1">
              <div class="grid grid-cols-2 gap-4">
                <UFormField
                  label="Nome"
                  name="firstName"
                  :error="errors.firstName || undefined"
                >
                  <UInput
                    v-model="step1Data.firstName"
                    type="text"
                    placeholder="Maria"
                    :disabled="loading"
                    size="xl"
                  />
                </UFormField>

                <UFormField
                  label="Sobrenome"
                  name="lastName"
                  :error="errors.lastName || undefined"
                >
                  <UInput
                    v-model="step1Data.lastName"
                    type="text"
                    placeholder="Silva"
                    :disabled="loading"
                    size="xl"
                  />
                </UFormField>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <UFormField
                  label="Telefone"
                  name="phone"
                  :error="errors.phone || undefined"
                >
                  <UInput
                    v-model="step1Data.phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    :disabled="loading"
                    size="xl"
                    icon="i-heroicons-phone"
                  />
                </UFormField>

                <UFormField
                  label="E-mail"
                  name="email"
                  :error="errors.email || undefined"
                >
                  <UInput
                    v-model="step1Data.email"
                    type="email"
                    placeholder="seu@email.com"
                    :disabled="loading"
                    size="xl"
                    icon="i-heroicons-envelope"
                    autocomplete="email"
                  />
                </UFormField>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <UFormField
                  label="Senha"
                  name="password"
                  :error="errors.password || undefined"
                >
                  <UInput
                    v-model="step1Data.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    :disabled="loading"
                    size="xl"
                    icon="i-heroicons-lock-closed"
                    autocomplete="new-password"
                    :ui="{ icon: { trailing: { pointer: '' } } }"
                  >
                    <template #trailing>
                      <UButton
                        :icon="
                          showPassword
                            ? 'i-heroicons-eye-slash'
                            : 'i-heroicons-eye'
                        "
                        variant="link"
                        color="gray"
                        size="xs"
                        @click="showPassword = !showPassword"
                        :padded="false"
                      />
                    </template>
                  </UInput>
                </UFormField>

                <UFormField
                  label="Confirmar Senha"
                  name="confirmPassword"
                  :error="errors.confirmPassword || undefined"
                >
                  <UInput
                    v-model="step1Data.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    :disabled="loading"
                    size="xl"
                    icon="i-heroicons-lock-closed"
                    autocomplete="new-password"
                    :ui="{ icon: { trailing: { pointer: '' } } }"
                  >
                    <template #trailing>
                      <UButton
                        :icon="
                          showConfirmPassword
                            ? 'i-heroicons-eye-slash'
                            : 'i-heroicons-eye'
                        "
                        variant="link"
                        color="gray"
                        size="xs"
                        @click="showConfirmPassword = !showConfirmPassword"
                        :padded="false"
                      />
                    </template>
                  </UInput>
                </UFormField>
              </div>
            </template>

            <!-- Step 2: Tea Information -->
            <template v-if="currentStep === 2">
              <UFormField
                size="xl"
                label="Número de Convidadas"
                name="guests"
                :error="errors.guests || undefined"
              >
                <UInputNumber
                  class="w-full"
                  v-model.number="step2Data.guests"
                  placeholder="50"
                  :disabled="loading"
                  size="xl"
                  icon="i-heroicons-user-group"
                  :min="0"
                />
              </UFormField>

              <UFormField
                label="Local do Evento"
                name="location"
                :error="errors.location || undefined"
              >
                <UInput
                  class="w-full"
                  v-model="step2Data.location"
                  type="text"
                  placeholder="Rua Exemplo, 123 - São Paulo"
                  :disabled="loading"
                  size="xl"
                  icon="i-heroicons-map-pin"
                />
              </UFormField>

              <div class="flex justify-between gap-2">
                <UFormField
                  label="Data do Chá de Lingerie"
                  name="showerDate"
                  :error="errors.showerDate || undefined"
                >
                  <DatePicker
                    icon="i-heroicons-heart"
                    v-model="step2Data.showerDate"
                    :disabled="loading"
                    size="xl"
                  />
                </UFormField>

                <UFormField
                  label="Data do Casamento"
                  name="weddingDate"
                  :error="errors.weddingDate || undefined"
                >
                  <DatePicker
                    icon="i-lucide-cake"
                    v-model="step2Data.weddingDate"
                    :disabled="loading"
                    size="xl"
                  />
                </UFormField>
              </div>
            </template>

            <!-- Step 3: Preferences -->
            <template v-if="currentStep === 3">
              <UFormField
                label="Estilo"
                name="style"
                :error="errors.style || undefined"
              >
                <URadioGroup
                  v-model="step3Data.style"
                  :items="[
                    { value: 1, label: 'Romântico' },
                    { value: 2, label: 'Sensual' },
                    { value: 3, label: 'Elegante' },
                    { value: 4, label: 'Divertido' },
                    { value: 5, label: 'Clássico' },
                    { value: 6, label: 'Moderno' },
                  ]"
                  :disabled="loading"
                  :ui="{ fieldset: 'grid grid-cols-3 gap-2 p-4' }"
                />
              </UFormField>

              <UFormField
                label="Cores Favoritas"
                name="favoriteColors"
                :error="errors.favoriteColors || undefined"
              >
                <div class="grid grid-cols-3 gap-2 p-4">
                  <UCheckbox
                    v-for="color in [
                      { value: 1, label: 'Branco' },
                      { value: 2, label: 'Preto' },
                      { value: 3, label: 'Vermelho' },
                      { value: 4, label: 'Lilás' },
                      { value: 5, label: 'Roxo' },
                      { value: 6, label: 'Marsala' },
                      { value: 7, label: 'Rosê (Rosa Claro)' },
                      { value: 8, label: 'Azul' },
                      { value: 9, label: 'Amarelo' },
                      { value: 10, label: 'Verde' },
                      { value: 11, label: 'Cinza' },
                      { value: 12, label: 'Terracota' },
                      { value: 13, label: 'Bege' },
                      { value: 14, label: 'Rubi' },
                    ]"
                    :key="color.value"
                    :model-value="
                      step3Data.favoriteColors.includes(color.value)
                    "
                    @update:model-value="
                      (checked) => {
                        if (checked) {
                          step3Data.favoriteColors.push(color.value);
                        } else {
                          const index = step3Data.favoriteColors.indexOf(
                            color.value,
                          );
                          if (index > -1)
                            step3Data.favoriteColors.splice(index, 1);
                        }
                      }
                    "
                    :label="color.label"
                    :disabled="loading"
                  />
                </div>
              </UFormField>

              <div class="grid grid-cols-3 gap-4">
                <UFormField
                  label="Sutiã Preferido"
                  name="preferredBra"
                  :error="errors.preferredBra || undefined"
                >
                  <URadioGroup
                    v-model="step3Data.preferredBra"
                    :items="[
                      { value: 1, label: 'Com Bojo' },
                      { value: 2, label: 'Sem Bojo' },
                      { value: 3, label: 'Ambos' },
                    ]"
                    :disabled="loading"
                    :ui="{ fieldset: 'gap-2 p-4' }"
                  />
                </UFormField>

                <UFormField
                  label="Modelo Preferido"
                  name="preferredModel"
                  :error="errors.preferredModel || undefined"
                >
                  <URadioGroup
                    v-model="step3Data.preferredModel"
                    :items="[
                      { value: 1, label: 'Com renda' },
                      { value: 2, label: 'Lisos' },
                      { value: 3, label: 'Ambos' },
                    ]"
                    :disabled="loading"
                    :ui="{ fieldset: 'gap-2 p-4' }"
                  />
                </UFormField>

                <UFormField
                  label="Calcinha Preferida"
                  name="preferredPanties"
                  :error="errors.preferredPanties || undefined"
                >
                  <URadioGroup
                    v-model="step3Data.preferredPanties"
                    :items="[
                      { value: 1, label: 'Fio Dental' },
                      { value: 2, label: 'Médias' },
                      { value: 3, label: 'Caleçon' },
                    ]"
                    :disabled="loading"
                    :ui="{ fieldset: 'gap-2 p-4' }"
                  />
                </UFormField>
              </div>

              <UFormField
                label="Tamanho"
                name="size"
                :error="errors.size || undefined"
              >
                <URadioGroup
                  v-model="step3Data.size"
                  :items="[
                    { value: 1, label: 'PP' },
                    { value: 2, label: 'P' },
                    { value: 3, label: 'M' },
                    { value: 4, label: 'G' },
                    { value: 5, label: 'GG' },
                    { value: 6, label: 'XG' },
                  ]"
                  :disabled="loading"
                  :ui="{ fieldset: 'grid grid-cols-6 gap-2 p-4' }"
                />
              </UFormField>

              <UFormField
                label="Modelos Permitidos"
                name="allowedModels"
                :error="errors.allowedModels || undefined"
              >
                <div class="grid grid-cols-3 gap-2 p-4">
                  <UCheckbox
                    v-for="model in [
                      { value: 1, label: 'Conjuntos' },
                      { value: 2, label: 'Camisola' },
                      { value: 3, label: 'Pijama Longo' },
                      { value: 4, label: 'Bodys' },
                      { value: 5, label: 'Baby Doll' },
                      { value: 6, label: 'Biquini' },
                    ]"
                    :key="model.value"
                    :model-value="step3Data.allowedModels.includes(model.value)"
                    @update:model-value="
                      (checked) => {
                        if (checked) {
                          step3Data.allowedModels.push(model.value);
                        } else {
                          const index = step3Data.allowedModels.indexOf(
                            model.value,
                          );
                          if (index > -1)
                            step3Data.allowedModels.splice(index, 1);
                        }
                      }
                    "
                    :label="model.label"
                    :disabled="loading"
                  />
                </div>
              </UFormField>

              <UFormField
                label="Modelos Não Permitidos"
                name="notAllowedModels"
                :error="errors.notAllowedModels || undefined"
              >
                <UInput
                  v-model="step3Data.notAllowedModels"
                  type="text"
                  placeholder="Ex: Model C"
                  :disabled="loading"
                  size="xl"
                />
              </UFormField>

              <UFormField
                label="Observações"
                name="notes"
                :error="errors.notes || undefined"
              >
                <UTextarea
                  v-model="step3Data.notes"
                  placeholder="Observações adicionais..."
                  :disabled="loading"
                  :rows="4"
                  size="xl"
                />
              </UFormField>
            </template>

            <!-- Step 4: Choose Format -->
            <template v-if="currentStep === 4">
              <UFormField
                label="Escolha a Embalagem"
                name="packaging"
                :error="errors.packaging || undefined"
              >
                <div class="grid grid-cols-1 gap-6">
                  <div
                    v-for="option in [
                      {
                        value: 1,
                        label: 'Bag',
                        description: 'Embalagem em sacola',
                        image: '/images/bag.png',
                      },
                      {
                        value: 2,
                        label: 'Box',
                        description: 'Embalagem em caixa',
                        image: '/images/box.png',
                      },
                    ]"
                    :key="option.value"
                    @click="step4Data.packaging = option.value"
                    :class="[
                      'relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary',
                      step4Data.packaging === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200',
                    ]"
                  >
                    <div class="flex items-center gap-4">
                      <img
                        :src="option.image"
                        :alt="option.label"
                        class="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div class="flex items-center gap-3 flex-1">
                        <div class="flex-shrink-0">
                          <div
                            :class="[
                              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                              step4Data.packaging === option.value
                                ? 'border-primary bg-primary'
                                : 'border-gray-300',
                            ]"
                          >
                            <div
                              v-if="step4Data.packaging === option.value"
                              class="w-2 h-2 rounded-full bg-white"
                            ></div>
                          </div>
                        </div>
                        <div>
                          <p class="font-semibold text-lg">
                            {{ option.label }}
                          </p>
                          <p class="text-sm text-gray-500">
                            {{ option.description }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </UFormField>
            </template>

            <UAlert
              v-if="generalError"
              color="red"
              variant="soft"
              icon="i-heroicons-exclamation-triangle"
              :title="generalError"
              :close-button="{
                icon: 'i-heroicons-x-mark',
                color: 'red',
                variant: 'link',
              }"
              @close="generalError = ''"
            />

            <div
              class="pt-2"
              :class="currentStep > 1 ? 'flex gap-3' : 'space-y-3'"
            >
              <UButton
                v-if="currentStep > 1"
                type="button"
                block
                variant="outline"
                color="gray"
                size="xl"
                @click="handleBack"
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
                <span class="font-semibold">{{
                  currentStep === 4 ? "Finalizar" : "Próximo"
                }}</span>
                <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
              </UButton>
            </div>
          </UForm>

          <template #footer>
            <div v-if="currentStep === 1" class="text-center text-sm">
              <span class="text-gray-600">Já tem uma conta?</span>
              <UButton
                variant="link"
                color="primary"
                :padded="false"
                @click="router.push('/login')"
                class="ml-1 font-semibold"
              >
                Fazer login
              </UButton>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: [],
  ssr: false,
});

const router = useRouter();

// Current step state
const currentStep = ref(1);

// Min date for date pickers (today)
const minDate = new Date();

// Step 1 data
const step1Data = reactive({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// Step 2 data
const step2Data = reactive({
  guests: null as number | null,
  location: "",
  showerDate: "",
  weddingDate: "",
});

// Step 3 data
const step3Data = reactive({
  style: null as number | null,
  favoriteColors: [] as number[],
  preferredBra: null as number | null,
  preferredModel: null as number | null,
  preferredPanties: null as number | null,
  size: null as number | null,
  allowedModels: [] as number[],
  notAllowedModels: "",
  notes: "",
});

// Step 4 data
const step4Data = reactive({
  packaging: null as number | null,
});

// Dynamic form data based on current step
const currentFormData = computed(() => {
  switch (currentStep.value) {
    case 1:
      return step1Data;
    case 2:
      return step2Data;
    case 3:
      return step3Data;
    case 4:
      return step4Data;
    default:
      return step1Data;
  }
});

// Step configuration
const stepConfig = computed(() => {
  const configs = {
    1: {
      title: "Cadastro",
      subtitle: "Passo 1 de 4 - Informações Básicas",
    },
    2: {
      title: "Informações do Chá",
      subtitle: "Passo 2 de 4 - Detalhes do Evento",
    },
    3: {
      title: "Preferências",
      subtitle: "Passo 3 de 4 - Suas Preferências",
    },
    4: {
      title: "Escolha seu Formato",
      subtitle: "Passo 4 de 4 - Formato do Catálogo",
    },
  };
  return configs[currentStep.value as keyof typeof configs];
});

const errors = reactive({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  guests: "",
  location: "",
  showerDate: "",
  weddingDate: "",
  style: "",
  favoriteColors: "",
  preferredBra: "",
  preferredModel: "",
  preferredPanties: "",
  size: "",
  allowedModels: "",
  notAllowedModels: "",
  notes: "",
  packaging: "",
});

const loading = ref(false);
const generalError = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Load step from sessionStorage on mount
onMounted(() => {
  if (import.meta.client) {
    const savedStep = sessionStorage.getItem("signup-current-step");
    if (savedStep) {
      currentStep.value = parseInt(savedStep);
    }

    // Load saved data if available
    const savedStep1 = sessionStorage.getItem("signup-step1");
    if (savedStep1) {
      Object.assign(step1Data, JSON.parse(savedStep1));
    }

    // Don't load step2Data from sessionStorage to avoid date format issues
    // const savedStep2 = sessionStorage.getItem("signup-step2");
    // if (savedStep2) {
    //   Object.assign(step2Data, JSON.parse(savedStep2));
    // }
  }
});

const validateStep1 = (): boolean => {
  let isValid = true;

  // Reset step 1 errors
  errors.firstName = "";
  errors.lastName = "";
  errors.phone = "";
  errors.email = "";
  errors.password = "";
  errors.confirmPassword = "";
  generalError.value = "";

  // Validate first name
  if (!step1Data.firstName.trim()) {
    errors.firstName = "Nome é obrigatório";
    isValid = false;
  } else if (step1Data.firstName.trim().length < 2) {
    errors.firstName = "Nome deve ter pelo menos 2 caracteres";
    isValid = false;
  }

  // Validate last name
  if (!step1Data.lastName.trim()) {
    errors.lastName = "Sobrenome é obrigatório";
    isValid = false;
  } else if (step1Data.lastName.trim().length < 2) {
    errors.lastName = "Sobrenome deve ter pelo menos 2 caracteres";
    isValid = false;
  }

  // Validate phone
  if (!step1Data.phone.trim()) {
    errors.phone = "Telefone é obrigatório";
    isValid = false;
  } else if (step1Data.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Telefone inválido";
    isValid = false;
  }

  // Validate email
  if (!step1Data.email.trim()) {
    errors.email = "E-mail é obrigatório";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1Data.email)) {
    errors.email = "E-mail inválido";
    isValid = false;
  }

  // Validate password
  if (!step1Data.password) {
    errors.password = "Senha é obrigatória";
    isValid = false;
  } else if (step1Data.password.length < 6) {
    errors.password = "Senha deve ter pelo menos 6 caracteres";
    isValid = false;
  }

  // Validate confirm password
  if (!step1Data.confirmPassword) {
    errors.confirmPassword = "Confirme sua senha";
    isValid = false;
  } else if (step1Data.password !== step1Data.confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem";
    isValid = false;
  }

  return isValid;
};

const validateStep2 = (): boolean => {
  let isValid = true;

  // Reset step 2 errors
  errors.guests = "";
  errors.location = "";
  errors.showerDate = "";
  errors.weddingDate = "";
  generalError.value = "";

  // Validate guests
  if (!step2Data.guests || step2Data.guests < 1) {
    errors.guests =
      "Número de convidadas é obrigatório e deve ser maior que zero";
    isValid = false;
  }

  // Validate location
  if (!step2Data.location.trim()) {
    errors.location = "Local é obrigatório";
    isValid = false;
  } else if (step2Data.location.trim().length < 5) {
    errors.location = "Local deve ter pelo menos 5 caracteres";
    isValid = false;
  }

  // Validate shower date
  if (!step2Data.showerDate) {
    errors.showerDate = "Data do chá de lingerie é obrigatória";
    isValid = false;
  } else {
    const showerDate = new Date(step2Data.showerDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    showerDate.setHours(0, 0, 0, 0);
    if (showerDate < today) {
      errors.showerDate = "A data deve ser no futuro";
      isValid = false;
    }
  }

  // Validate wedding date
  if (!step2Data.weddingDate) {
    errors.weddingDate = "Data do casamento é obrigatória";
    isValid = false;
  } else {
    const weddingDate = new Date(step2Data.weddingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    weddingDate.setHours(0, 0, 0, 0);
    if (weddingDate < today) {
      errors.weddingDate = "A data deve ser no futuro";
      isValid = false;
    }

    // Wedding date should be after or equal to shower date
    if (step2Data.showerDate) {
      const showerDate = new Date(step2Data.showerDate);
      showerDate.setHours(0, 0, 0, 0);
      if (weddingDate < showerDate) {
        errors.weddingDate =
          "Data do casamento deve ser igual ou posterior ao chá";
        isValid = false;
      }
    }
  }

  return isValid;
};

const validateStep3 = (): boolean => {
  let isValid = true;

  // Reset step 3 errors
  errors.style = "";
  errors.favoriteColors = "";
  errors.preferredBra = "";
  errors.preferredModel = "";
  errors.preferredPanties = "";
  errors.size = "";
  errors.allowedModels = "";
  errors.notAllowedModels = "";
  errors.notes = "";
  generalError.value = "";

  // Validate required fields
  if (!step3Data.style) {
    errors.style = "Estilo é obrigatório";
    isValid = false;
  }

  if (step3Data.favoriteColors.length === 0) {
    errors.favoriteColors = "Selecione pelo menos uma cor";
    isValid = false;
  }

  if (!step3Data.preferredBra) {
    errors.preferredBra = "Sutiã preferido é obrigatório";
    isValid = false;
  }

  if (!step3Data.preferredModel) {
    errors.preferredModel = "Modelo preferido é obrigatório";
    isValid = false;
  }

  if (!step3Data.preferredPanties) {
    errors.preferredPanties = "Calcinha preferida é obrigatória";
    isValid = false;
  }

  if (!step3Data.size) {
    errors.size = "Tamanho é obrigatório";
    isValid = false;
  }

  return isValid;
};

const formatDateToISO = (dateString: string | object): string => {
  if (!dateString) return "";

  // If it's already a string, create a Date from it
  if (typeof dateString === "string") {
    const date = new Date(dateString);
    return date.toISOString();
  }

  // If it's an object from the date picker (with year, month, day properties)
  if (
    typeof dateString === "object" &&
    "year" in dateString &&
    "month" in dateString &&
    "day" in dateString
  ) {
    const date = new Date(
      dateString.year,
      dateString.month - 1,
      dateString.day,
    );
    return date.toISOString();
  }

  return "";
};

const handleStep1 = async () => {
  if (!validateStep1()) {
    return;
  }

  loading.value = true;

  try {
    // Prepare data for backend
    const signupData = {
      username: `${step1Data.firstName.trim()} ${step1Data.lastName.trim()}`,
      phone_number: step1Data.phone.replace(/\D/g, ""),
      email: step1Data.email.trim(),
      password: step1Data.password,
    };

    const config = useRuntimeConfig();
    const url = `${config.public.apiBase}/api/register`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    });

    const data = await response.json();

    if (response.ok) {
      // Save user session just like login
      const auth = useAuth();
      auth.user.value = data.user;
      auth.token.value = data.token;

      // Store in localStorage for persistence
      if (import.meta.client) {
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("auth-user", JSON.stringify(data.user));
        // Store step 1 data and move to step 2
        sessionStorage.setItem("signup-step1", JSON.stringify(signupData));
        sessionStorage.setItem("signup-current-step", "2");
      }

      useToast().add({
        title: "Conta criada com sucesso!",
        description: "Continue para completar seu cadastro",
        color: "green",
        icon: "i-heroicons-check-circle",
      });

      // Move to step 2
      currentStep.value = 2;
    } else if (response.status === 409) {
      // Handle duplicate email
      errors.email = "Este e-mail já está cadastrado";
      generalError.value =
        "E-mail já cadastrado. Tente fazer login ou use outro e-mail.";
    } else {
      // Handle other errors
      generalError.value =
        data?.error || "Erro ao processar o cadastro. Tente novamente.";
    }
  } catch (err: any) {
    generalError.value = "Erro ao conectar com o servidor. Tente novamente.";
  } finally {
    loading.value = false;
  }
};

const handleStep2 = async () => {
  if (!validateStep2()) {
    return;
  }

  console.log(step2Data);

  loading.value = true;

  try {
    // Prepare data for backend API
    const showerData = {
      guests: step2Data.guests,
      location: step2Data.location.trim(),
      shower_date: formatDateToISO(step2Data.showerDate),
      wedding_date: formatDateToISO(step2Data.weddingDate),
    };

    const config = useRuntimeConfig();
    const auth = useAuth();
    const url = `${config.public.apiBase}/api/showers`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token.value}`,
      },
      body: JSON.stringify(showerData),
    });

    const data = await response.json();

    if (response.ok) {
      // Store the shower ID for later use
      if (import.meta.client && data.ID) {
        sessionStorage.setItem("shower_id", data.ID.toString());
      }

      // Store step 2 data in session storage
      if (import.meta.client) {
        sessionStorage.setItem("signup-step2", JSON.stringify(showerData));
        sessionStorage.setItem("signup-current-step", "3");
      }

      useToast().add({
        title: "Informações salvas!",
        description: "Continue para o próximo passo",
        color: "green",
        icon: "i-heroicons-check-circle",
      });

      // Move to step 3
      currentStep.value = 3;
    } else {
      generalError.value =
        data?.error || "Erro ao salvar as informações. Tente novamente.";
    }
  } catch (err: any) {
    generalError.value = "Erro ao processar os dados. Tente novamente.";
  } finally {
    loading.value = false;
  }
};

const handleStep3 = async () => {
  if (!validateStep3()) {
    return;
  }

  loading.value = true;

  try {
    // Get shower_id from sessionStorage
    const showerId = import.meta.client
      ? sessionStorage.getItem("shower_id")
      : null;

    if (!showerId) {
      generalError.value =
        "ID do chá não encontrado. Por favor, volte e complete o passo 2 novamente.";
      loading.value = false;
      return;
    }

    // Prepare preferences data for backend
    const preferencesData = {
      style: step3Data.style,
      favoriteColors: step3Data.favoriteColors,
      preferredBra: step3Data.preferredBra,
      preferredModel: step3Data.preferredModel,
      preferredPanties: step3Data.preferredPanties,
      size: step3Data.size,
      allowedModels: step3Data.allowedModels,
      notAllowedModels: step3Data.notAllowedModels.trim(),
      notes: step3Data.notes.trim(),
    };

    console.log(preferencesData);

    const config = useRuntimeConfig();
    const auth = useAuth();
    const url = `${config.public.apiBase}/api/showers/${showerId}/preferences`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token.value}`,
      },
      body: JSON.stringify(preferencesData),
    });

    const data = await response.json();

    if (response.ok) {
      useToast().add({
        title: "Preferências salvas!",
        description: "Continue para o último passo",
        color: "green",
        icon: "i-heroicons-check-circle",
      });

      // Move to step 4
      if (import.meta.client) {
        sessionStorage.setItem("signup-current-step", "4");
      }
      currentStep.value = 4;
    } else {
      generalError.value =
        data?.error || "Erro ao salvar as preferências. Tente novamente.";
    }
  } catch (err: any) {
    generalError.value = "Erro ao finalizar o cadastro. Tente novamente.";
  } finally {
    loading.value = false;
  }
};

const validateStep4 = (): boolean => {
  let isValid = true;

  errors.packaging = "";
  generalError.value = "";

  if (!step4Data.packaging) {
    errors.packaging = "Escolha uma opção de embalagem";
    isValid = false;
  }

  return isValid;
};

const handleStep4 = async () => {
  if (!validateStep4()) {
    return;
  }

  loading.value = true;

  try {
    // Get shower_id from sessionStorage
    const showerId = import.meta.client
      ? sessionStorage.getItem("shower_id")
      : null;

    if (!showerId) {
      generalError.value =
        "ID do chá não encontrado. Por favor, volte e complete o passo 2 novamente.";
      loading.value = false;
      return;
    }

    // Prepare catalog data for backend
    const catalogData = {
      Package: step4Data.packaging,
    };

    console.log("Packaging selected:", catalogData);

    const config = useRuntimeConfig();
    const auth = useAuth();
    const url = `${config.public.apiBase}/api/showers/${showerId}/catalog`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token.value}`,
      },
      body: JSON.stringify(catalogData),
    });

    const data = await response.json();

    if (response.ok && response.status === 201) {
      useToast().add({
        title: "Cadastro finalizado!",
        description: "Seu catálogo está sendo preparado",
        color: "green",
        icon: "i-heroicons-check-circle",
      });

      // Clear session data
      if (import.meta.client) {
        sessionStorage.removeItem("signup-step1");
        sessionStorage.removeItem("signup-step2");
        sessionStorage.removeItem("signup-current-step");
        sessionStorage.removeItem("shower_id");
      }

      // Redirect to home page
      router.push("/");
    } else {
      generalError.value =
        data?.error || "Erro ao salvar o formato. Tente novamente.";
    }
  } catch (err: any) {
    generalError.value = "Erro ao finalizar o cadastro. Tente novamente.";
  } finally {
    loading.value = false;
  }
};

const handleNext = async () => {
  switch (currentStep.value) {
    case 1:
      await handleStep1();
      break;
    case 2:
      await handleStep2();
      break;
    case 3:
      await handleStep3();
      break;
    case 4:
      await handleStep4();
      break;
  }
};

const handleBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    if (import.meta.client) {
      sessionStorage.setItem(
        "signup-current-step",
        currentStep.value.toString(),
      );
    }
  }
};
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
