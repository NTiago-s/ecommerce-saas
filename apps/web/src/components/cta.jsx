// import Button from "@/components/ui/button";
import Button from "../ui/button";

export default function CTA() {
  return (
    <section className="bg-blue-700 text-white py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-bold">Empieza a vender hoy</h2>

        <p className="mt-4 text-blue-100">
          Crea tu tienda, activa tu plan y escala tu negocio.
        </p>

        <Button variant="light" size="lg" className="mt-8">
          Probar gratis
        </Button>
      </div>
    </section>
  );
}
