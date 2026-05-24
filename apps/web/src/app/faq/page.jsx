import Faq from "../../components/faq";
import Button from "../../ui/button";

export const metadata = {
  title: "FAQ",
  description:
    "Preguntas frecuentes sobre planes, cobro mensual, conversion a ARS y acceso a tu cuenta.",
};

export default function FaqPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-[var(--border)] bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              FAQ
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Dudas frecuentes antes de comprar tu plan.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Respuestas cortas y directas para decidir rapido y sin perder
              contexto.
            </p>
          </div>
        </div>
      </section>

      <Faq />

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="surface-soft px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Siguiente paso
                </span>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Cuando quieras avanzar, pasas por los planes y empezas.
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/planes">Ver planes</Button>
                <Button href="/contacto" variant="outline">
                  Contacto
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
