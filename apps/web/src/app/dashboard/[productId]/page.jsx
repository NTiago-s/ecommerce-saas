import { auth } from "../../../auth";
import prisma from "../../../lib/prisma";
import { getProductById } from "../../actions/store-actions/products/get-products";
import { redirect } from "next/navigation";
import ProductDetailClient from "../../../components/dashboard/products/product-detail-client";

export default async function ProductDetailPage({ params, searchParams }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { productId } = await params;

  if (!productId) {
    redirect("/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      stores: {
        select: {
          id: true,
          name: true,
          medusaSalesChannelId: true,
        },
      },
    },
  });

  if (!user?.stores?.length) {
    redirect("/dashboard");
  }

  const requestedStoreId = (await searchParams)?.storeId;
  const store =
    (requestedStoreId
      ? user.stores.find((s) => s.id === requestedStoreId)
      : null) || user.stores[0];

  // Fetch product details
  let product = null;
  let productStore = null;

  try {
    // Try to find the product in any of the user's stores
    for (const userStore of user.stores) {
      const productData = await getProductById(productId, userStore.id);
      if (productData) {
        product = productData;
        productStore = userStore;
        break;
      }
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }

  if (!product) {
    redirect("/dashboard");
  }

  return (
    <ProductDetailClient
      product={product}
      store={productStore}
      stores={user.stores}
    />
  );
}
