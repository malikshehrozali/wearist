import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react';
import { clearCart } from '../../store/features/cartSlice';

const CheckoutSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (sessionId && orderId) {
                try {
                    // Fetch order details from your backend
                    const response = await fetch(`/api/orders/${orderId}`);
                    if (response.ok) {
                        const order = await response.json();
                        setOrderDetails(order);
                    }
                } catch (error) {
                    console.error('Error fetching order details:', error);
                }
            }
            setLoading(false);
        };

        // Clear the cart since payment was successful
        dispatch(clearCart());

        fetchOrderDetails();
    }, [sessionId, orderId, dispatch]);

    const handleContinueShopping = () => {
        navigate('/shop/home');
    };

    const handleViewOrders = () => {
        navigate('/shop/account?tab=orders');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Payment Successful!
                    </h1>
                    <p className="text-lg text-gray-600">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>

                    {orderDetails ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Order Number</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {orderDetails.orderNumber || orderId}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                                    <p className="text-lg font-semibold text-green-600">
                                        ${orderDetails.totalAmount?.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {orderDetails.items && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-3">Items Ordered</p>
                                    <div className="space-y-3">
                                        {orderDetails.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between border-b pb-2">
                                                <div className="flex items-center space-x-3">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-12 h-12 object-cover rounded-md"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-gray-900">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-500">Loading order details...</p>
                        </div>
                    )}
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                <Mail className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Order Confirmation</p>
                                <p className="text-sm text-gray-600">
                                    You'll receive an email confirmation with your order details shortly.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                                <Package className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Order Processing</p>
                                <p className="text-sm text-gray-600">
                                    We're preparing your items for shipment. This usually takes 1-2 business days.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                <Truck className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Shipping</p>
                                <p className="text-sm text-gray-600">
                                    Once shipped, you'll receive tracking information to monitor your delivery.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleViewOrders}
                        className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition flex items-center justify-center space-x-2"
                    >
                        <span>View My Orders</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handleContinueShopping}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
                    >
                        Continue Shopping
                    </button>
                </div>

                {/* Support Info */}
                <div className="text-center mt-8 p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">
                        Questions about your order? Contact our support team at{' '}
                        <a href="mailto:support@wearits.com" className="text-blue-600 hover:text-blue-800">
                            support@wearits.com
                        </a>{' '}
                        or call{' '}
                        <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-800">
                            (123) 456-7890
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;