import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      addToCart({
        ...item,
        quantity: newQuantity,
      });
      if (newQuantity > item.quantity) {
        toast.info(`Increased ${item.name} quantity to ${newQuantity}`);
      } else if (newQuantity < item.quantity) {
        toast.info(`Decreased ${item.name} quantity to ${newQuantity}`);
      }
    }
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item._id);
    toast.success(`${item.name} removed from cart`);
  };

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'vision10') {
      setCouponDiscount(10);
      setCouponError('');
      toast.success('Coupon applied: 10% discount');
    } else if (couponCode.toLowerCase() === 'vision20') {
      setCouponDiscount(20);
      setCouponError('');
      toast.success('Coupon applied: 20% discount');
    } else {
      setCouponError('Invalid coupon code');
      setCouponDiscount(0);
      toast.error('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.info('Please login to proceed with checkout');
      navigate('/login?redirect=checkout');
    } else {
      toast.success('Proceeding to checkout');
      navigate('/checkout');
    }
  };

  const subtotal = getCartTotal();
  const discount = (subtotal * (couponDiscount / 100)).toFixed(2);
  const tax = ((subtotal - discount) * 0.07).toFixed(2);
  const shipping = subtotal > 0 ? 12.99 : 0;
  const total = (
    subtotal -
    parseFloat(discount) +
    parseFloat(tax) +
    shipping
  ).toFixed(2);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-4 px-6 text-left">Product</th>
                      <th className="py-4 px-6 text-center">Quantity</th>
                      <th className="py-4 px-6 text-right">Price</th>
                      <th className="py-4 px-6 text-right">Total</th>
                      <th className="py-4 px-6"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item._id} className="border-b border-gray-200">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/64x64?text=Product';
                              }}
                            />
                            <div className="ml-4">
                              <Link
                                to={`/products/${item._id}`}
                                className="text-blue-600 hover:text-blue-800 font-semibold"
                              >
                                {item.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              className="text-gray-500 focus:outline-none focus:text-gray-600"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </button>
                            <span className="mx-2 text-gray-700">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              className="text-gray-500 focus:outline-none focus:text-gray-600"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          ₹{item.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleRemoveItem(item)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800 font-semibold">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-gray-800 text-white p-2 rounded-r"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-sm mt-1">{couponError}</p>
                  )}
                  {couponDiscount > 0 && (
                    <p className="text-green-500 text-sm mt-1">
                      {couponDiscount}% discount applied!
                    </p>
                  )}
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-red-600 font-semibold">
                      -₹{discount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax (7%)</span>
                  <span className="text-gray-800 font-semibold">₹{tax}</span>
                </div>

                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800 font-semibold">
                    ₹{shipping.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-6">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-blue-600">
                      ₹{total}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    to="/products"
                    className="w-full mt-4 inline-block text-center bg-white border border-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
