// File: src/pages/shop/CheckoutCancel.jsx
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingCart, CreditCard } from 'lucide-react';

const CheckoutCancel = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const orderId = searchParams.get('order_id');

    useEffect(() => {
        // Optional: Update order status to cancelled in your backend
        const updateOrderStatus = async () => {
            if (orderId) {
                try {
                    await fetch(`/api/orders/${orderId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            status: 'cancelled',
                            paymentStatus: 'cancelled'
                        }),
                    });
                } catch (error) {
                    console.error('Error updating order status:', error);
                }
            }
        };

        updateOrderStatus();
    }, [orderId]);

    const handleRetryPayment = () => {
        // Navigate back to checkout
        navigate('/shop/checkout');
    };

    const handleContinueShopping = () => {
        navigate('/shop/home');
    };

    const handleViewCart = () => {
        navigate('/shop/home'); // Assuming cart opens from header
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Cancel Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Payment Cancelled
                    </h1>
                    <p className="text-lg text-gray-600">
                        Your payment was cancelled and no charges were made to your account.
                    </p>
                </div>

                {/* Information Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">What happened?</h2>

                    <div className="space-y-3 text-gray-600">
                        <p>• Your payment process was interrupted or cancelled</p>
                        <p>• No payment has been processed</p>
                        <p>• Your cart items are still saved and available</p>
                        {orderId && (
                            <p>• Order #{orderId} has been marked as cancelled</p>
                        )}
                    </div>
                </div>

                {/* Troubleshooting Tips */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Having trouble with payment?</h2>

                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-900">Check your payment method</p>
                                <p className="text-sm text-gray-600">
                                    Ensure your card details are correct and your card has sufficient funds.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                                <span className="text-white text-xs font-bold">!</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Browser issues</p>
                                <p className="text-sm text-gray-600">
                                    Try refreshing the page, clearing your browser cache, or using a different browser.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                                <span className="text-white text-xs font-bold">?</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Still having issues?</p>
                                <p className="text-sm text-gray-600">
                                    Contact our support team at{' '}
                                    <a href="mailto:support@wearits.com" className="text-blue-600 hover:text-blue-800">
                                        support@wearits.com
                                    </a>{' '}
                                    or{' '}
                                    <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-800">
                                        (123) 456-7890
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={handleRetryPayment}
                        className="w-full bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition flex items-center justify-center space-x-2"
                    >
                        <CreditCard className="w-4 h-4" />
                        <span>Try Payment Again</span>
                    </button>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleViewCart}
                            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition flex items-center justify-center space-x-2"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>View Cart</span>
                        </button>

                        <button
                            onClick={handleContinueShopping}
                            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition flex items-center justify-center space-x-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Continue Shopping</span>
                        </button>
                    </div>
                </div>

                {/* Additional Help */}
                <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                        <strong>Need immediate assistance?</strong><br />
                        Our customer service team is available 24/7 to help you complete your purchase.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutCancel;