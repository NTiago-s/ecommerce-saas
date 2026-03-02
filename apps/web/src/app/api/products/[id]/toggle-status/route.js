import { toggleProductStatus } from "../../../../actions/store-actions/products/delete-product";

export async function PATCH(request, { params }) {
  const { id } = params;
  const url = new URL(request.url);
  const storeId = url.searchParams.get("storeId");

  try {
    const result = await toggleProductStatus(id, storeId);

    if (result.success) {
      return Response.json({ success: true, data: result.data });
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
