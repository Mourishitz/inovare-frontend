import { createAbacateBilling } from "~~/server/utils/abacate";
import {
  fetchPublicCatalogBySlug,
  findCatalogProduct,
} from "~~/server/utils/public-catalog";

interface PurchaseBody {
  productId?: string;
  customer?: {
    name?: string;
    email?: string;
    cellphone?: string;
    taxId?: string;
  };
  currentUrl?: string;
}

const isValidHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const slug = getRouterParam(event, "slug");
  const body = await readBody<PurchaseBody>(event);

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug inválido." });
  }

  if (!config.abacatePayToken) {
    throw createError({
      statusCode: 500,
      statusMessage: "ABACATE_PAY_TOKEN não configurado.",
    });
  }

  if (
    !body.productId ||
    !body.customer?.name?.trim() ||
    !body.customer?.email?.trim() ||
    !body.customer?.cellphone?.trim() ||
    !body.customer?.taxId?.trim() ||
    !body.currentUrl ||
    !isValidHttpUrl(body.currentUrl)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Dados de compra inválidos.",
    });
  }

  const catalogResponse = await fetchPublicCatalogBySlug(config.public.apiBase, slug);
  const product = findCatalogProduct(catalogResponse, body.productId);

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "Produto não encontrado neste catálogo.",
    });
  }

  if (product.isBought) {
    throw createError({
      statusCode: 409,
      statusMessage: "Este produto já foi comprado.",
    });
  }

  const checkoutRedirectUrl = new URL(body.currentUrl);

  const externalId = `catalog:${product.catalogId}:product:${product.productId}:checkout:${Date.now()}`;

  const billing = await createAbacateBilling(
    config.abacatePayApiBase,
    config.abacatePayToken,
    {
      frequency: "ONE_TIME",
      methods: ["PIX"],
      products: [
        {
          externalId,
          name: product.name,
          description: product.description,
          quantity: 1,
          price: product.price,
        },
      ],
      returnUrl: checkoutRedirectUrl.toString(),
      completionUrl: checkoutRedirectUrl.toString(),
      customer: {
        name: body.customer.name.trim(),
        email: body.customer.email.trim(),
        cellphone: body.customer.cellphone.trim(),
        taxId: body.customer.taxId.trim(),
      },
    },
  );

  return {
    checkoutUrl: billing.url,
  };
});
