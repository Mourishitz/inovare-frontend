<template>
  <ClientOnly>
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full">
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
            Gerenciador de Chás de Lingerie
          </p>
        </div>

        <UCard class="shadow-2xl backdrop-blur-sm bg-white/90 animate-slide-up">
          <template #header>
            <h3 class="text-xl font-semibold text-gray-900">
              Bem-vinda de volta!
            </h3>
            <p class="text-sm text-gray-500 mt-1">Entre com suas credenciais</p>
          </template>

          <UForm :state="credentials" @submit="handleLogin" class="space-y-5">
            <UFormField label="E-mail" name="email" :error="emailError || undefined">
              <UInput
                v-model="credentials.email"
                type="email"
                placeholder="seu@email.com"
                :disabled="loading"
                size="xl"
                icon="i-heroicons-envelope"
                autocomplete="email"
              />
            </UFormField>

            <UFormField label="Senha" name="password" :error="passwordError || undefined">
              <UInput
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :disabled="loading"
                size="xl"
                icon="i-heroicons-lock-closed"
                autocomplete="password"
                :ui="{ icon: { trailing: { pointer: '' } } }"
              >
                <template #trailing>
                  <UButton
                    :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                    variant="link"
                    color="gray"
                    size="xs"
                    @click="showPassword = !showPassword"
                    :padded="false"
                  />
                </template>
              </UInput>
            </UFormField>

            <UAlert 
              v-if="error" 
              color="red" 
              variant="soft"
              icon="i-heroicons-exclamation-triangle"
              :title="error"
              :close-button="{ icon: 'i-heroicons-x-mark', color: 'red', variant: 'link' }"
              @close="error = ''"
            />

            <div class="pt-2">
              <UButton
                type="submit"
                block
                :loading="loading"
                size="xl"
                color="primary"
                class="shadow-lg hover:shadow-xl transition-shadow"
              >
                <span class="font-semibold">Entrar</span>
              </UButton>
            </div>
          </UForm>

          <template #footer>
            <div class="text-center text-sm">
              <span class="text-gray-600">Não tem uma conta?</span>
              <UButton
                variant="link"
                color="primary"
                :padded="false"
                @click="router.push('/signup')"
                class="ml-1 font-semibold"
              >
                Cadastre-se
              </UButton>
            </div>
          </template>
        </UCard>

        <div class="mt-6 text-center text-xs text-gray-500">
          <p>© 2026 Inovare. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { LoginCredentials } from "~/types";
import { UserRole } from "~/types";

definePageMeta({
  layout: "auth",
  middleware: [],
  ssr: false,
});

const config = useRuntimeConfig();
const router = useRouter();

const credentials = reactive<LoginCredentials>({
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref("");
const emailError = ref("");
const passwordError = ref("");
const showPassword = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = "";
  emailError.value = "";
  passwordError.value = "";

  if (!credentials.email) {
    emailError.value = "E-mail é obrigatório";
    loading.value = false;
    return;
  }

  if (!credentials.password) {
    passwordError.value = "Senha é obrigatória";
    loading.value = false;
    return;
  }

  const url = `${config.public.apiBase}/api/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.token && data.user) {
      // Store user and token in auth state
      const auth = useAuth();
      auth.user.value = data.user;
      auth.token.value = data.token;

      // Store in localStorage for persistence
      if (import.meta.client) {
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("auth-user", JSON.stringify(data.user));
      }

      useToast().add({
        title: "Login realizado!",
        description: "Bem-vinda de volta",
        color: "green",
        icon: "i-heroicons-check-circle",
      });

      // Navigate based on role
      if (data.user.role === UserRole.ADMIN) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      error.value = data?.message || "E-mail ou senha inválidos";
    }
  } catch (err: any) {
    error.value = "Erro ao fazer login. Tente novamente.";
  } finally {
    loading.value = false;
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
