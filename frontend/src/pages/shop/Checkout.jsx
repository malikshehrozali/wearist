import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShoppingBag, ArrowLeft, Lock, Truck } from 'lucide-react';

const Checkout = () => {
    const { items } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth); // Get user info
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const handleCheckout = async () => {
        if (items.length === 0) {
            setError('Your cart is empty');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Prepare items for Stripe
            const stripeItems = items.map(item => ({
                name: item.name,
                description: item.description || '',
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }));

            // Generate a unique order ID
            const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Create checkout session
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: stripeItems,
                    successUrl: `${window.location.origin}/shop/checkout/success`,
                    cancelUrl: `${window.location.origin}/shop/checkout/cancel`,
                    customerEmail: user?.email || 'customer@example.com',
                    userId: user?.id || user?._id || 'guest',
                    metadata: {
                        orderId: orderId,
                        userId: user?.id || user?._id || 'guest',
                        itemCount: items.length,
                        subtotal: subtotal.toFixed(2),
                        shipping: shipping.toFixed(2),
                        tax: tax.toFixed(2),
                        total: total.toFixed(2)
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const { sessionId, url } = data;

            if (url) {
                // Redirect to Stripe Checkout
                window.location.href = url;
            } else {
                throw new Error('No checkout URL received');
            }

        } catch (error) {
            console.error('Checkout error:', error);
            setError(error.message || 'Something went wrong with checkout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToCart = () => {
        navigate('/shop/home'); // This will open the cart in header
    };

    if (items.length === 0) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="text-center py-12">
                    <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout.</p>
                    <button
                        onClick={() => navigate('/shop/home')}
                        className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <button
                    onClick={handleBackToCart}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Shopping
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        Order Summary
                    </h2>

                    {/* Items */}
                    <div className="space-y-4 mb-6">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Quantity: {item.quantity}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        ${item.price.toFixed(2)} each
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="text-gray-900">
                                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax:</span>
                            <span className="text-gray-900">${tax.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-green-600">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    {shipping === 0 && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center text-green-800">
                                <Truck className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">Free shipping applied!</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment
                    </h2>

                    {/* Customer Info */}
                    {user && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                            <p className="text-sm text-gray-600">
                                <strong>Email:</strong> {user.email}
                            </p>
                            {user.name && (
                                <p className="text-sm text-gray-600">
                                    <strong>Name:</strong> {user.name}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Payment Features */}
                    <div className="mb-6 space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                            <Lock className="w-4 h-4 mr-2 text-green-600" />
                            Secure SSL encrypted payment
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                            Accepts all major credit cards
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Truck className="w-4 h-4 mr-2 text-purple-600" />
                            Free shipping on orders over $50
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Checkout Button */}
                    <button
                        onClick={handleCheckout}
                        disabled={loading || items.length === 0}
                        className="w-full bg-black text-white py-4 px-4 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                <span>Secure Checkout - ${total.toFixed(2)}</span>
                            </>
                        )}
                    </button>

                    {/* Security Notice */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                            Your payment information is processed securely by Stripe.
                            <br />
                            We do not store your credit card details.
                        </p>
                    </div>

                    {/* Powered by Stripe */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400">
                            Powered by{' '}
                            <span className="font-semibold text-blue-600">Stripe</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;