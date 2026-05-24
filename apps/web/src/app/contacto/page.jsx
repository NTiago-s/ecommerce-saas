import { ArrowRight, Mail, MessageSquareText, PhoneCall } from "lucide-react";
import Button from "../../ui/button";

export const metadata = {
  title: "Contacto",
  description:
    "Canales de contacto para resolver dudas sobre planes, acceso y soporte antes de comprar.",
};

const contactChannels = [
  {
    icon: Mail,
    title: "Ayuda antes de comprar",
    description:
      "Si tenes dudas sobre que plan elegir, este es el canal adecuado.",
    href: "mailto:hola@codeluxe-store.com?subject=Consulta%20Codeluxe%20Store",
    action: "Escribir",
  },
  {
    icon: MessageSquareText,
    title: "Dudas de pago",
    description:
      "Consultas sobre suscripcion mensual, conversion a ARS o plan gratis.",
    href: "mailto:pago@codeluxe-store.com?subject=Pago%20Codeluxe%20Store",
    action: "Consultar",
  },
  {
    icon: PhoneCall,
    title: "Soporte de cuenta",
    description:
      "Si ya compraste un plan, te ayudamos con acceso y puesta en marcha.",
    href: "/login",
    action: "Ingresar",
  },
];

export default function ContactoPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-[var(--border)] bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Contacto
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Contacto directo para dudas antes de elegir tu plan.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Todo el sitio esta pensado para convertir. Si queres ayuda para
              decidir o queres resolver una duda puntual, escribinos.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {contactChannels.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="surface p-6">
                  <div className="inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-slate-50">
                    <Icon className="size-5 text-[var(--accent)]" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-slate-950">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                  <div className="mt-6">
                    <Button href={item.href} variant="outline" fullWidth>
                      {item.action}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="surface-soft px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Acceso directo
                </span>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Si ya elegiste tu plan, crea tu cuenta y seguí el proceso.
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/register" variant="outline">
                  Crear cuenta
                </Button>
                <Button href="/planes">
                  Ver planes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
