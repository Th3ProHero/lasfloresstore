import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-cream-300 overflow-hidden animate-pulse">
            <div className="h-48 bg-cream-200" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-cream-300 rounded w-16" />
              <div className="h-5 bg-cream-300 rounded w-3/4" />
              <div className="h-3 bg-cream-300 rounded w-1/3" />
              <div className="h-6 bg-cream-300 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="font-display text-xl text-slate-dark mb-2">No se encontraron productos</h3>
        <p className="text-sm text-slate-mid">Intenta con otros filtros o busca algo diferente.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
