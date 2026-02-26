import { toggleProductStatus } from "../../../../app/actions/store-actions/products/delete-product";

export async function PATCH(request, { params }) {
  const { id } = params;

  try {
    const result = await toggleProductStatus(id);
    
    if (result.success) {
      return Response.json({ success: true, data: result.data });
    } else {
      return Response.json({ success: false, error: result.error }, { status: 400 });
    }
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
