import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    // Shipping info
    fullName: user ? user.name : '',
    email: user ? user.email : '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    // No payment info needed for Cash on Delivery
  });

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate shipping info
      if (!formData.fullName || !formData.email || !formData.address || 
          !formData.city || !formData.postalCode || !formData.country) {
        toast.error('Please fill in all shipping information');
        return setError('Please fill in all shipping information');
      }
    }
    setError(null);
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create order
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          price: item.price,
          // Using a valid ObjectId format for the sample product
          // MongoDB requires a 24-character hex string
          product: "507f1f77bcf86cd799439011", // This is a valid ObjectId format
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: 'Cash on Delivery',
        totalPrice: getCartTotal(),
      };

      const { data } = await api.post('/orders', orderData);
      
      // Clear cart
      clearCart();
      
      // Show success message
      toast.success('Order placed successfully! Your order will be delivered within 3-5 business days.');
      
      // Redirect to order success page
      navigate(`/order-success/${data._id}`);
      
      // We don't need the fallback navigation anymore as we're handling navigation properly
    } catch (err) {
      // Show error toast notification
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'There was an issue placing your order. Please try again.'
      );
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const tax = (subtotal * 0.07).toFixed(2);
  const shipping = 12.99;
  const total = (parseFloat(subtotal) + parseFloat(tax) + shipping).toFixed(2);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout steps and form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {/* Progress steps */}
              <div className="flex mb-8">
                <div className={`flex-1 text-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    1
                  </div>
                  <div className="text-sm mt-1">Shipping</div>
                </div>
                <div className={`flex-1 text-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    2
                  </div>
                  <div className="text-sm mt-1">Review</div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                      >
                        Continue to Review
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Review Order (Previously Step 3) */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <p className="mb-1">{formData.fullName}</p>
                        <p className="mb-1">{formData.email}</p>
                        <p className="mb-1">{formData.address}</p>
                        <p>{formData.city}, {formData.postalCode}</p>
                        <p>{formData.country}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                      <div className="bg-gray-50 p-4 rounded flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="font-medium">Cash on Delivery</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                      <div className="bg-gray-50 p-4 rounded">
                        {cartItems.map((item) => (
                          <div key={item._id} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                            <div className="flex items-center">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded mr-4"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/40x40';
                                }}
                              />
                              <div>
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition ${
                          loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <LoadingSpinner size={8} color="#ffffff" />
                            <span className="ml-2">Processing...</span>
                          </span>
                        ) : (
                          'Place Order'
                        )}
                      </button>
                    </div>
                  </div>
                )}


              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="mb-4">
                <div className="max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                      <div className="flex items-center">
                        <span className="font-semibold mr-1">{item.quantity}x</span>
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7%)</span>
                  <span className="font-semibold">₹{tax}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-blue-600">₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
