// ProductGridClient.jsx
"use client";

import ProductCard from "./card-store";

export default function ProductGridClient({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
