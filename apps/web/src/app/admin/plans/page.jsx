import prisma from "../../../lib/prisma";
import { createPlan, deletePlan, updatePlan } from "../../actions/admin-actions/plans";
import Button from "../../../ui/button";

function PlanForm({ mode, plan }) {
  const action =
    mode === "edit" ? updatePlan.bind(null, plan.id) : createPlan;

  return (
    <form action={action} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">
          {mode === "edit" ? "Editar plan" : "Crear plan"}
        </h2>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-sm font-semibold text-gray-800">Nombre</span>
          <input
            name="name"
            defaultValue={plan?.name ?? ""}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-semibold text-gray-800">Precio</span>
          <input
            name="price"
            type="number"
            defaultValue={plan?.price ?? ""}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-semibold text-gray-800">Moneda</span>
          <input
            name="currency"
            defaultValue={plan?.currency ?? "usd"}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-semibold text-gray-800">stripePriceId</span>
          <input
            name="stripePriceId"
            defaultValue={plan?.stripePriceId ?? ""}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-semibold text-gray-800">Max stores</span>
          <input
            name="maxStores"
            type="number"
            defaultValue={plan?.maxStores ?? ""}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-semibold text-gray-800">Max products</span>
          <input
            name="maxProducts"
            type="number"
            defaultValue={plan?.maxProducts ?? ""}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-semibold text-gray-800">Max orders</span>
          <input
            name="maxOrders"
            type="number"
            defaultValue={plan?.maxOrders ?? ""}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-semibold text-gray-800">Max staff</span>
          <input
            name="maxStaff"
            type="number"
            defaultValue={plan?.maxStaff ?? ""}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="grid gap-1 sm:col-span-2">
          <span className="text-sm font-semibold text-gray-800">Features (JSON)</span>
          <textarea
            name="features"
            defaultValue={plan?.features ? JSON.stringify(plan.features, null, 2) : "{}"}
            rows={6}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="mt-4">
        <Button variant="primary" fullWidth>
          {mode === "edit" ? "Guardar cambios" : "Crear"}
        </Button>
      </div>
    </form>
  );
}

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <PlanForm mode="create" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Planes</h2>
          <span className="text-sm text-gray-600">{plans.length}</span>
        </div>

        <div className="mt-4 grid gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-gray-200 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-600">
                    {plan.currency?.toUpperCase?.() ?? "USD"} {plan.price}
                    {" "}
                    <span className="text-xs text-gray-500">({plan.stripePriceId})</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Stores: {plan.maxStores ?? "∞"} | Products: {plan.maxProducts ?? "∞"} | Orders: {plan.maxOrders ?? "∞"} | Staff: {plan.maxStaff ?? "∞"}
                  </p>
                </div>

                <form action={deletePlan.bind(null, plan.id)}>
                  <Button variant="outline" size="sm">
                    Eliminar
                  </Button>
                </form>
              </div>

              <div className="mt-4">
                <PlanForm mode="edit" plan={plan} />
              </div>
            </div>
          ))}

          {plans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
              No hay planes todavía.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
