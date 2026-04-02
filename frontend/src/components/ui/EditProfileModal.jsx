import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { HiX, HiCheck } from 'react-icons/hi';
import { updateProfile } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, login } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    celular: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        nombre: user.username || '',
        correo: user.correo || '',
        celular: user.celular || ''
      });
      setError('');
      setSuccess('');
    }
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // The API returns message, nombre, correo, celular
      const res = await updateProfile(user.userId, formData);
      
      // Update session
      const token = localStorage.getItem('token');
      login({
        ...user,
        username: res.nombre,
        correo: res.correo,
        celular: res.celular
      }, token);

      setSuccess('Perfil actualizado correctamente.');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 bg-black/0"
          enterTo="opacity-100 bg-black/40"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 bg-black/40"
          leaveTo="opacity-0 bg-black/0"
        >
          <div className="fixed inset-0" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-5">
                  <Dialog.Title as="h3" className="text-xl font-display font-bold text-slate-dark text-center flex-1">
                    Editar Mi Perfil 🌸
                  </Dialog.Title>
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-cream-200 transition text-slate-mid">
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-50 text-sage-dark p-3 rounded-lg text-sm text-center border border-green-100 flex items-center justify-center gap-2">
                       <HiCheck className="w-5 h-5 text-sage" /> {success}
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-mid uppercase tracking-widest ml-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="mt-1 block w-full px-4 py-3 border border-cream-300 rounded-xl bg-cream-50 focus:bg-white focus:ring-2 focus:ring-terracotta outline-none transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-mid uppercase tracking-widest ml-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      className="mt-1 block w-full px-4 py-3 border border-cream-300 rounded-xl bg-cream-50 focus:bg-white focus:ring-2 focus:ring-terracotta outline-none transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-mid uppercase tracking-widest ml-1">Celular (Opcional)</label>
                    <input
                      type="tel"
                      value={formData.celular}
                      onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                      className="mt-1 block w-full px-4 py-3 border border-cream-300 rounded-xl bg-cream-50 focus:bg-white focus:ring-2 focus:ring-terracotta outline-none transition-all shadow-sm"
                    />
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading || success}
                      className="w-full flex justify-center py-3 px-4 rounded-xl text-white font-bold bg-terracotta hover:bg-terracotta-dark shadow-md transition disabled:opacity-50"
                    >
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
