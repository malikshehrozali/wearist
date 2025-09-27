import React, { useState } from 'react'
import { ShoppingBag, Heart, User, Search, Bell, Plus, Minus, Trash2, X } from "lucide-react";
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, decreaseQuantity } from '../../store/features/cartSlice';
import { addToCart } from '../../store/features/cartSlice';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { toast } from 'sonner';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const cartItems = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const navLinks = [
    { name: "Men", path: "/men" },
    { name: "Women", path: "/women" },
    { name: "Kids", path: "/kids" },
    { name: "New Arrivals", path: "/new" },
    { name: "Sale", path: "/shop/home" },
  ];

  // Cart functions
  const handleIncreaseQuantity = (product) => {
    dispatch(addToCart({ product }));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity({ productId }));
  };

  const handleRemoveItem = (index) => {
    dispatch(removeFromCart(index));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/shop/checkout'); // Navigate to checkout page
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    navigate('/shop/home'); // Navigate to shop page
  };

  const handleSubscribe = () => {
    toast("You have been subscribed to our newsletter!");
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <NavLink to={"/"} className="flex items-center gap-2 text-2xl font-bold tracking-wide text-yellow-original dark:text-white cursor-pointer">
            Wearits
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-8 font-medium">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `transition ${link.name === "Sale"
                      ? isActive
                        ? "text-red-500 hover:text-black"
                        : "text-yellow-original"
                      : isActive
                        ? "text-black dark:text-white"
                        : "text-yellow-original dark:text-gray-200 hover:text-black dark:hover:text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-64 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
              />
              <Search className="absolute right-3 top-2.5 text-gray-500" size={18} />
            </div>

            {/* Icons */}
            <Bell className="cursor-pointer hover:text-yellow-500 transition" onClick={handleSubscribe} />
            <div className="relative cursor-pointer">
              <ShoppingBag
                className="cursor-pointer hover:text-green-600 transition"
                onClick={() => setIsCartOpen(true)}
              />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </div>
            <User className="cursor-pointer hover:text-blue-600 transition" />
          </div>
          {/* Mobile Hamburger */}
          <div className='flex items-center gap-3'>
            <div className="relative cursor-pointer md:hidden">
              <ShoppingBag
                className="cursor-pointer hover:text-green-600 transition"
                onClick={() => setIsCartOpen(true)}
              />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </div>
            <button
              className="md:hidden text-2xl text-gray-900 dark:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-100 dark:bg-gray-800 p-4 flex flex-col gap-4 text-gray-700 dark:text-gray-200">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
              />
              <Search className="absolute right-3 top-2.5 text-gray-500" size={18} />
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-3 font-medium">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `transition ${link.name === "Sale"
                      ? isActive
                        ? "text-red-600"
                        : "text-red-500 hover:text-red-600"
                      : isActive
                        ? "text-black dark:text-white"
                        : "hover:text-black dark:hover:text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Icons Section */}
            <div className="flex justify-around pt-3 border-t border-gray-300 dark:border-gray-600">
              <Bell className="cursor-pointer hover:text-yellow-500 transition" onClick={handleSubscribe} />
              <User className="cursor-pointer hover:text-blue-600 transition" />
            </div>
          </div>
        )}
      </header>

      {/* Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side='right' className="w-full sm:max-w-lg flex flex-col h-full">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={24} />
                Shopping Cart ({cartItems} items)
              </div>

            </SheetTitle>
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 justify-end"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </SheetHeader>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag size={64} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some products to get started!</p>
                <button
                  onClick={handleContinueShopping}
                  className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item._id}_${index}`}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* Product Image */}
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

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ${item.price.toFixed(2)} each
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDecreaseQuantity(item._id)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-semibold text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncreaseQuantity(item)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold px-5">
                <span>Total:</span>
                <span className="text-green-600">${totalPrice.toFixed(2)}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Additional Info */}
              <div className="text-xs text-gray-500 text-center">
                <p>Free shipping on orders over $50</p>
                <p>Secure checkout with SSL encryption</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Header