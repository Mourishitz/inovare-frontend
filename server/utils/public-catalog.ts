interface BackendCatalogResponse {
  catalog: {
    ID: number;
    approved: boolean;
    url: string;
    package: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  host?: {
    username: string;
  };
  products: Array<{
    ID: number;
    price: number;
    is_bought: boolean;
    product: {
      ID: number;
      name: string;
      description: string;
      image_url: string;
    };
  }>;
}

export interface CatalogProductDetails {
  catalogId: string;
  catalogUrl: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  isBought: boolean;
}

export const fetchPublicCatalogBySlug = async (
  apiBase: string,
  slug: string,
): Promise<BackendCatalogResponse> =>
  await $fetch<BackendCatalogResponse>(`${apiBase}/api/catalogs/url/${slug}`);

export const findCatalogProduct = (
  catalogResponse: BackendCatalogResponse,
  productId: string,
): CatalogProductDetails | null => {
  const item = catalogResponse.products.find(
    (product) => String(product.product.ID) === productId,
  );

  if (!item) return null;

  return {
    catalogId: String(catalogResponse.catalog.ID),
    catalogUrl: catalogResponse.catalog.url,
    productId,
    name: item.product.name,
    description: item.product.description,
    price: item.price,
    isBought: item.is_bought,
  };
};
