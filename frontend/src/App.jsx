import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import WhatsAppButton from './components/ui/WhatsAppButton';

const HomePage         = lazy(() => import('./pages/HomePage'));
const CatalogPage      = lazy(() => import('./pages/CatalogPage'));
const ProductPage      = lazy(() => import('./pages/ProductPage'));
const CheckoutPage     = lazy(() => import('./pages/CheckoutPage'));
const LoginPage        = lazy(() => import('./pages/LoginPage'));
const RegisterPage     = lazy(() => import('./pages/RegisterPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const SpecialOrderPage = lazy(() => import('./pages/SpecialOrderPage'));
const AboutPage        = lazy(() => import('./pages/AboutPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage  = lazy(() => import('./pages/ResetPasswordPage'));
const NotFoundPage     = lazy(() => import('./pages/NotFoundPage'));
const AdminLoginPage   = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-cream-50">
              <div className="w-10 h-10 border-4 border-cream-200 border-t-terracotta rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="catalogo" element={<CatalogPage />} />
                <Route path="producto/:id" element={<ProductPage />} />
                <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="login" element={<LoginPage />} />
                <Route path="registro" element={<RegisterPage />} />
                <Route path="mis-pedidos" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
                <Route path="pedidos-especiales" element={<SpecialOrderPage />} />
                <Route path="nosotros" element={<AboutPage />} />
                <Route path="privacidad" element={<PrivacyPolicyPage />} />
                <Route path="recuperar-contrasena" element={<ForgotPasswordPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>

            {/* Global floating button */}
            <WhatsAppButton />
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
