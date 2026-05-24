const FAQ_ITEMS = [
  {
    question: "Puedo empezar gratis?",
    answer:
      "Si. El plan Prueba es gratis de forma ilimitada y sirve para comenzar sin comprometerte desde el primer dia.",
  },
  {
    question: "Como se cobra el plan?",
    answer:
      "El cobro mensual se procesa con Mercado Pago. Los precios se expresan en USD y se convierten a ARS con el dolar oficial.",
  },
  {
    question: "Puedo cambiar de plan mas adelante?",
    answer:
      "Si. La cuenta esta pensada para subir de plan cuando necesites mas tiendas o mas capacidad por tienda.",
  },
  {
    question: "Cuantas tiendas puedo crear?",
    answer:
      "Depende del plan elegido. Hay planes con 1, 3 o 5 tiendas, y el plan profesional permite una operacion mas amplia.",
  },
  {
    question: "Puedo cancelar cuando quiera?",
    answer:
      "Si. La suscripcion se maneja por mes y podes revisar o cancelar cuando lo necesites.",
  },
  {
    question: "Hay soporte si tengo dudas?",
    answer:
      "Si. Tenes una seccion de contacto para resolver preguntas antes de comprar o mientras configuras tu cuenta.",
  },
];

export default function FAQ() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="faq-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            FAQ
          </span>
          <h2
            id="faq-title"
            className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
          >
            Preguntas comunes antes de elegir un plan
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Resolvemos las dudas mas frecuentes para que la decision sea rapida
            y sin friccion.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="surface group rounded-[1.25rem] p-6"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
