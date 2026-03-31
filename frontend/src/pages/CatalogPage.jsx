import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts } from '../api/client';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import FloatingFlowers from '../components/ui/FloatingFlowers';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState({
    categoria: searchParams.get('categoria') || null,
    marca: searchParams.get('marca') || null,
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, size: 12 };
      if (filters.categoria) params.categoria = filters.categoria;
      if (filters.marca) params.marca = filters.marca;
      if (filters.search) params.search = filters.search;

      const data = await getProducts(params);
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0);

    const params = new URLSearchParams();
    if (newFilters.categoria) params.set('categoria', newFilters.categoria);
    if (newFilters.marca) params.set('marca', newFilters.marca);
    if (newFilters.search) params.set('search', newFilters.search);
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Elemento decorativo */}
      <FloatingFlowers count={30} opacity={0.06} className="pointer-events-none fixed" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative z-10"
      >
        <h1 className="font-display text-3xl font-bold text-slate-dark">Catálogo</h1>
        <p className="text-sm text-slate-mid mt-1">
          {loading ? 'Cargando...' : `${totalElements} productos encontrados`}
        </p>
      </motion.div>

      <div className="flex gap-8">
        {/* Filters */}
        <ProductFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Products */}
        <div className="flex-1">
          <ProductGrid products={products} loading={loading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 rounded-xl border border-cream-300 hover:bg-cream-200
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <HiChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(0, Math.min(page - 2, totalPages - 5));
                const pageNum = start + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200
                      ${pageNum === page
                        ? 'bg-terracotta text-white shadow-md'
                        : 'border border-cream-300 text-slate-mid hover:bg-cream-200'
                      }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-xl border border-cream-300 hover:bg-cream-200
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <HiChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
