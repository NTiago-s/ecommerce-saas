import { auth } from "../../../auth";
import prisma from "../../../lib/prisma";
import { getProductsFromMedusa } from "../../../app/actions/store-actions/products/get-products";
import ProductsClientPage from "../../../components/dashboard/products/products-client-page";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
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

  const store = user.stores[0];
  
  let products = [];
  try {
    products = await getProductsFromMedusa(null, store.medusaSalesChannelId);
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return <ProductsClientPage products={products} store={store} />;
}
