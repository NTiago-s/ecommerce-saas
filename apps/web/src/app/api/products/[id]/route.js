import { deleteMedusaProduct } from "../../../actions/store-actions/products/delete-product";

export async function DELETE(request, { params }) {
  const { id } = params;
  const url = new URL(request.url);
  const storeId = url.searchParams.get("storeId");

  try {
    const result = await deleteMedusaProduct(id, storeId);

    if (result.success) {
      return Response.json({ success: true });
    } else {
      return Response.json(
        { success: false, error: result.error },
        { status: 400 },
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
