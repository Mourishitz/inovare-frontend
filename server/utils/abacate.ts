interface AbacateResponse<T> {
  data: T | null;
  error: {
    message?: string;
    details?: unknown;
  } | string | null;
  success?: boolean;
}

export interface AbacateBillingProduct {
  id: string;
  externalId: string;
  quantity: number;
}

export interface AbacateBilling {
  id: string;
  url: string;
  amount: number;
  status: string;
  methods: string[];
  products: AbacateBillingProduct[];
}

const getAbacateHeaders = (token: string) => ({
  accept: "application/json",
  authorization: `Bearer ${token}`,
  "content-type": "application/json",
});

const translateAbacateErrorMessage = (message?: string | null) => {
  if (message === "Invalid taxId") {
    return "CPF ou CNPJ inválido";
  }

  return message || "Erro ao comunicar com a Abacate Pay.";
};

const getAbacateErrorMessage = (error: AbacateResponse<unknown>["error"]) => {
  if (typeof error === "string") {
    return translateAbacateErrorMessage(error);
  }

  return translateAbacateErrorMessage(error?.message);
};

export const createAbacateBilling = async (
  apiBase: string,
  token: string,
  body: Record<string, unknown>,
): Promise<AbacateBilling> => {
  let response: AbacateResponse<AbacateBilling>;

  try {
    response = await $fetch<AbacateResponse<AbacateBilling>>(
      `${apiBase}/v1/billing/create`,
      {
        method: "POST",
        headers: getAbacateHeaders(token),
        body,
      },
    );
  } catch (err: any) {
    throw createError({
      statusCode: err?.statusCode || err?.status || 502,
      statusMessage: translateAbacateErrorMessage(
        err?.data?.error?.message ||
          err?.data?.error ||
          err?.statusMessage ||
          err?.message,
      ),
    });
  }

  if (!response.data) {
    throw createError({
      statusCode: 502,
      statusMessage: getAbacateErrorMessage(response.error),
    });
  }

  return response.data;
};
