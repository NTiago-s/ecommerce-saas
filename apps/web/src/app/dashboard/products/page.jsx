import { auth } from "../../../auth";
import prisma from "../../../lib/prisma";
import { getProductsGroupedByChannel } from "../../../app/actions/store-actions/products/get-products";
import ProductsClientPage from "../../../components/dashboard/products/products-client-page";
import { redirect } from "next/navigation";

export default async function ProductsPage({ searchParams }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
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

  const requestedStoreId = searchParams?.storeId;
  const store =
    (requestedStoreId
      ? user.stores.find((s) => s.id === requestedStoreId)
      : null) || user.stores[0];

  // Fetch products grouped by store/channel
  let productsByStore = {};
  try {
    productsByStore = await getProductsGroupedByChannel(null, user.stores);
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <ProductsClientPage
      productsByStore={productsByStore}
      store={store}
      stores={user.stores}
    />
  );
}
