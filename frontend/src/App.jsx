import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import NotFound from './pages/NotFound';
import Loader from './components/common/Loader';
import AuthLayout from './components/auth/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { Toaster } from './components/ui/sonner';
import AuthCheck from './components/common/AuthCheck';
import { useSelector } from 'react-redux';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Features from './pages/admin/Features';
import ShopLayout from './components/shop/ShopLayout';
import Home from './pages/shop/Home';
import Listings from './pages/shop/Listings';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Checkout from './pages/shop/Checkout';
import Account from './pages/shop/Account';
import Search from './pages/shop/Search';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Add success and cancel pages
import CheckoutSuccess from './pages/shop/CheckoutSuccess';
import CheckoutCancel from './pages/shop/CheckoutCancel';

const App = () => {
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);

  // Get Stripe publishable key from environment variables
  const getStripeKey = () => {
    // For Vite projects
    if (import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY) {
      return import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    }
    // For Create React App projects
    // if (process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
    //   return process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    // }
    // Fallback - you can temporarily hardcode your test key here for testing
    // return 'pk_test_51...'; // Replace with your actual test key
    return null;
  };

  const stripeKey = getStripeKey();
  console.log('Stripe Key:', stripeKey); // Debug log

  // Only initialize Stripe if we have a valid key
  const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

  useEffect(() => {
    // Simplified loading logic
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  // Don't render anything if Stripe hasn't loaded or key is missing
  if (!stripeKey) {
    console.error('Stripe publishable key not found. Please check your environment variables.');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Configuration Error</h2>
          <p className="text-gray-600">Stripe configuration is missing. Please check your environment variables.</p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
            <p className="text-sm font-semibold">Expected environment variables:</p>
            <ul className="text-sm text-gray-600 mt-2">
              <li>• For Vite: VITE_STRIPE_PUBLISHABLE_KEY</li>
              <li>• For CRA: REACT_APP_STRIPE_PUBLISHABLE_KEY</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      {loading ? (
        <Loader />
      ) : (
        <div className='flex flex-col bg-white overflow-hidden'>
          <Toaster position='bottom-right' richColors />
          <Routes>
            <Route
              path='/'
              element={
                <AuthCheck isAuthenticated={isAuthenticated} user={user}>
                  <Navigate to="/shop/home" replace />
                </AuthCheck>
              }
            />

            {/* Auth Routes */}
            <Route
              path='/auth'
              element={
                <AuthCheck isAuthenticated={isAuthenticated} user={user}>
                  <AuthLayout />
                </AuthCheck>
              }
            >
              <Route index element={<Navigate to="login" replace />} />
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path='/admin'
              element={
                <AuthCheck isAuthenticated={isAuthenticated} user={user}>
                  <AdminLayout />
                </AuthCheck>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='features' element={<Features />} />
              <Route path='products' element={<Products />} />
              <Route path='orders' element={<Orders />} />
            </Route>

            {/* Shop Routes */}
            <Route
              path='/shop'
              element={
                <AuthCheck isAuthenticated={isAuthenticated} user={user}>
                  <ShopLayout />
                </AuthCheck>
              }
            >
              <Route index element={<Navigate to="home" replace />} />
              <Route path='home' element={<Home />} />
              <Route path='listings' element={<Listings />} />
              <Route path='checkout' element={<Checkout />} />
              <Route path='account' element={<Account />} />
              <Route path='search' element={<Search />} />

              {/* Add Stripe success/cancel routes */}
              <Route path='checkout/success' element={<CheckoutSuccess />} />
              <Route path='checkout/cancel' element={<CheckoutCancel />} />
            </Route>

            {/* 404 Route */}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      )}
    </Elements>
  )
}

export default App