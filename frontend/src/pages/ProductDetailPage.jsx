import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (id === 'sample-product') {
          // This is our main product, load it directly without API call
          setProduct({
            _id: 'sample-product',
            name: 'VisionAssist Pro',
            description: 'Our flagship vision assistance device for the visually impaired. The VisionAssist Pro uses advanced computer vision and AI technology to help blind individuals perceive their environment. Using a combination of cameras, sensors, and processors, the device can identify objects, read text, recognize faces, and provide spatial awareness through intuitive haptic feedback and voice descriptions.',
            price: 1299.99,
            imageUrl: 'https://www.pmu.edu.sa/Attachments/Academics/Images/UDP/CCES/Smart-Glasses-For-Blind-People-img1.PNG',
            countInStock: 10,
            features: [
              'Real-time object detection and identification',
              'Text recognition and reading capability',
              'Face recognition for familiar people',
              'Spatial awareness through haptic feedback',
              'Voice assistance with natural language processing'
            ]
          });
          setError(null);
        } else if (id) {
          try {
            const { data } = await api.get(`/products/${id}`);
            if (data) {
              setProduct(data);
              setError(null);
            } else {
              throw new Error('Product not found');
            }
          } catch (apiErr) {
            // If API fails, redirect to the sample product
            window.location.href = '/products/sample-product';
          }
        } else {
          throw new Error('Invalid product ID');
        }
      } catch (err) {
        const errorMessage = err.response && err.response.data.message
          ? err.response.data.message
          : 'Could not load product details. Please try again.';
        
        setError(errorMessage);
        toast.error(errorMessage);
        // Use dummy product in case of error
        setProduct({
          _id: 'sample-product',
          name: 'VisionAssist Pro',
          description: 'Our flagship vision assistance device for the visually impaired. The VisionAssist Pro uses advanced computer vision and AI technology to help blind individuals perceive their environment. Using a combination of cameras, sensors, and processors, the device can identify objects, read text, recognize faces, and provide spatial awareness through intuitive haptic feedback and voice descriptions.',
          price: 1299.99,
          imageUrl: 'https://www.pmu.edu.sa/Attachments/Academics/Images/UDP/CCES/Smart-Glasses-For-Blind-People-img1.PNG',
          countInStock: 10,
          features: [
            'Real-time object detection and identification',
            'Text recognition and reading capability',
            'Face recognition for familiar people',
            'Spatial awareness through haptic feedback',
            'Voice assistance with natural language processing',
            'GPS navigation and guidance',
            '12-hour battery life',
            'Water resistant design',
            'Lightweight and comfortable to wear'
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
    });
    toast.success(`${product.name} added to cart`);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart({
      ...product,
      quantity,
    });
    toast.success(`${product.name} purchase initiated`);
    navigate('/checkout');
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        {loading ? (
          <LoadingSpinner size={15} color="#3B82F6" />
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : product ? (
          <div className="flex flex-col md:flex-row -mx-4">
            <div className="md:flex-1 px-4 mb-8 md:mb-0">
              <div className="text-center bg-gray-100 rounded-lg p-4 mb-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="inline-block w-auto max-w-full mx-auto"
                  style={{ height: 'auto' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x400?text=VisionAssist';
                  }}
                />
              </div>
              <div className="flex -mx-2 mb-4">
                <div className="w-1/2 px-2">
                  <button 
                    className="w-full bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 transition"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="w-1/2 px-2">
                  <button 
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-full font-bold hover:bg-blue-600 transition"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
            <div className="md:flex-1 px-4">
              <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 ml-2">4.0 (42 reviews)</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Availability: <span className="text-green-600">In Stock</span> ({product.countInStock} available)
              </p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                <span className="text-gray-500 text-sm ml-2">Tax included</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button 
                    className="text-gray-500 focus:outline-none focus:text-gray-600"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                  <span className="text-gray-700 mx-2">{quantity}</span>
                  <button 
                    className="text-gray-500 focus:outline-none focus:text-gray-600"
                    onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                  >
                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Key Features</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {product.features && product.features.map((feature, index) => (
                    <li key={index} className="mb-1">{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Product not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
