import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiPlus, HiPhotograph, HiLogout, HiX, HiPencil, HiTrash } from 'react-icons/hi';
import client, { getProducts, updateProduct } from '../../api/client';

const CATEGORIAS = [
  'BEBIDAS', 'LACTEOS', 'BOTANAS', 'LIMPIEZA', 'HIGIENE',
  'ENLATADOS', 'ABARROTES', 'DULCES', 'CONGELADOS',
  'FRUTAS_VERDURAS', 'PANADERIA', 'MASCOTAS'
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    nombre: '', marca: '', precio: '', categoria: 'ABARROTES', 
    enOferta: false, porcentajeDescuento: 0,
    numInventario: '', descripcion: '', imagenUrl: ''
  };

  const [form, setForm] = useState(initialFormState);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // Verificar que estemos autenticados
    if (!localStorage.getItem('token')) {
      navigate('/admin');
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await getProducts({ size: 100, sortBy: 'id', direction: 'desc' });
      setProducts(res.content || []);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  // Convert File to Base64 String
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // Limitar a 2MB
      alert('La imagen es muy grande. Máximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreviewImage(base64String);
      setForm({ ...form, imagenUrl: base64String });
    };
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(initialFormState);
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setForm({
      nombre: p.nombre || '',
      marca: p.marca || '',
      precio: p.precio || '',
      categoria: p.categoria || 'ABARROTES',
      enOferta: p.enOferta || false,
      porcentajeDescuento: p.porcentajeDescuento || 0,
      numInventario: p.numInventario || '',
      descripcion: p.descripcion || '',
      imagenUrl: p.imagenUrl || ''
    });
    setPreviewImage(p.imagenUrl || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await client.delete('/products/' + id);
      fetchDashboardData();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        precio: parseFloat(form.precio),
        porcentajeDescuento: parseInt(form.porcentajeDescuento || 0),
        numInventario: parseInt(form.numInventario),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await client.post('/products', payload);
      }

      setIsModalOpen(false);
      setForm(initialFormState);
      setPreviewImage(null);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Error al guardar: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 pb-12">
      {/* Navbar Minimalista Admin */}
      <nav className="bg-slate-dark text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="font-display text-xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-4">
              <button onClick={() => navigate('/')} className="text-sm text-cream-200 hover:text-white transition">
                Ir a la Tienda
              </button>
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm bg-warmred px-3 py-1.5 rounded-lg hover:bg-red-700 transition">
                <HiLogout /> Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl font-bold text-slate-dark">Mis Productos</h2>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-sage hover:bg-sage-dark text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all"
          >
            <HiPlus className="w-5 h-5" />
            Nuevo Producto
          </button>
        </div>

        {/* Tabla Simple de Productos */}
        <div className="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-mid">
            <thead className="bg-cream-50 text-xs uppercase font-semibold text-slate-dark border-b border-cream-300">
              <tr>
                <th className="px-6 py-4">Foto</th>
                <th className="px-6 py-4">Nombre / Marca</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-cream-200 hover:bg-cream-50 transition-colors">
                  <td className="px-6 py-4">
                     {p.imagenUrl ? (
                        <div className="w-12 h-12 bg-cream-200 rounded-lg overflow-hidden flex items-center justify-center">
                          <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-cover" />
                        </div>
                     ) : (
                        <div className="w-12 h-12 bg-cream-200 rounded-lg flex items-center justify-center text-xl">📦</div>
                     )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-dark">{p.nombre}</p>
                    <p className="text-xs">{p.marca}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-terracotta/10 text-terracotta text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                      {p.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                     {p.numInventario}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-dark">
                    <div className="flex flex-col">
                       <span>${Number(p.precioFinal).toFixed(2)}</span>
                       {p.enOferta && <span className="text-xs text-warmred">(-{p.porcentajeDescuento}%)</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button onClick={() => handleOpenEdit(p)} className="p-2 bg-cream-200 hover:bg-terracotta hover:text-white rounded-lg transition-colors text-slate-dark" title="Editar">
                         <HiPencil />
                       </button>
                       <button onClick={() => handleDelete(p.id)} className="p-2 bg-cream-200 hover:bg-warmred hover:text-white rounded-lg transition-colors text-slate-dark" title="Eliminar">
                         <HiTrash />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-light">No hay productos. Agrega uno.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Creación */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden mt-10 md:mt-0"
          >
            <div className="flex justify-between items-center p-6 border-b border-cream-300 bg-cream-50">
              <h3 className="font-display text-2xl font-bold text-slate-dark">
                {editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-cream-200 rounded-lg text-slate-dark">
                <HiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                
                {/* Columna Izquierda: Imagen */}
                <div>
                  <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-2">
                    Fotografía (Local a Base64)
                  </label>
                  <div className="border-2 border-dashed border-cream-400 rounded-2xl h-48 flex flex-col items-center justify-center bg-cream-50 relative overflow-hidden group hover:border-terracotta transition-colors">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-slate-mid group-hover:text-terracotta flex flex-col items-center">
                         <HiPhotograph className="w-10 h-10 mb-2 opacity-50" />
                         <span className="text-sm font-medium">Clic para subir imagen</span>
                         <span className="text-xs opacity-75 mt-1">JPG, PNG (Max 2MB)</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Columna Derecha: Datos Basicos */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Nombre</label>
                    <input type="text" required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full px-4 py-2 bg-cream-50 border border-cream-300 rounded-xl text-sm focus:ring-2 focus:border-terracotta" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Marca</label>
                      <input type="text" required value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} className="w-full px-4 py-2 bg-cream-50 border border-cream-300 rounded-xl text-sm focus:ring-2 focus:border-terracotta" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Precio ($)</label>
                      <input type="number" step="0.01" required value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} className="w-full px-4 py-2 bg-cream-50 border border-cream-300 rounded-xl text-sm focus:ring-2 focus:border-terracotta" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Categoría</label>
                      <select required value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className="w-full px-4 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-sm focus:ring-2 focus:border-terracotta">
                        {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Stock</label>
                      <input type="number" required value={form.numInventario} onChange={e => setForm({...form, numInventario: e.target.value})} className="w-full px-4 py-2 bg-cream-50 border border-cream-300 rounded-xl text-sm focus:ring-2 focus:border-terracotta" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-4 border-t border-cream-200">
                <div className="flex items-center gap-3">
                   <input type="checkbox" id="oferta" checked={form.enOferta} onChange={e => setForm({...form, enOferta: e.target.checked})} className="w-5 h-5 text-terracotta border-cream-300 rounded focus:ring-terracotta" />
                   <label htmlFor="oferta" className="text-sm font-semibold text-slate-dark">¿En Oferta?</label>
                </div>
                <div className="md:col-span-2">
                   <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${!form.enOferta ? 'text-slate-light' : 'text-slate-mid'}`}>Porcentaje de Descuento (%)</label>
                   <input type="number" min="0" max="100" disabled={!form.enOferta} value={form.porcentajeDescuento} onChange={e => setForm({...form, porcentajeDescuento: e.target.value})} className="w-full px-4 py-2 bg-cream-50 border border-cream-300 rounded-xl text-sm focus:ring-2 focus:border-terracotta disabled:opacity-50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Descripción Breve</label>
                <textarea rows="2" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} className="w-full px-4 py-2 bg-cream-50 border border-cream-300 rounded-xl text-sm focus:ring-2 focus:border-terracotta resize-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-cream-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-semibold text-slate-mid hover:bg-cream-200 transition">Cancelar</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl font-semibold text-white bg-terracotta hover:bg-terracotta-dark shadow-md transition disabled:opacity-50 flex items-center gap-2">
                   {loading ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
