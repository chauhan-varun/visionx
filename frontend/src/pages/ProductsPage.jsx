import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AnimatedCard from '../components/animations/AnimatedCard';
import { StaggerContainer, StaggerItem, AnimatedButton } from '../components/animations/AnimatedElements';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products');
        // If no products yet, use a dummy product
        if (data.length === 0) {
          setProducts([{
            _id: 'sample-product',
            name: 'VisionAssist Pro',
            description: 'Our flagship vision assistance device for the visually impaired',
            price: 1299.99,
            imageUrl: 'https://www.pmu.edu.sa/Attachments/Academics/Images/UDP/CCES/Smart-Glasses-For-Blind-People-img1.PNG',
            countInStock: 10,
            features: [
              'Real-time object detection',
              'Voice assistance',
              'Haptic feedback',
              'GPS navigation',
              '12-hour battery life'
            ]
          }]);
        } else {
          setProducts(data);
        }
        setError(null);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Could not load products. Please try again.'
        );
        // Use dummy product in case of error
        setProducts([{
          _id: 'sample-product',
          name: 'VisionAssist Pro',
          description: 'Our flagship vision assistance device for the visually impaired',
          price: 1299.99,
          imageUrl: 'https://www.pmu.edu.sa/Attachments/Academics/Images/UDP/CCES/Smart-Glasses-For-Blind-People-img1.PNG',
          countInStock: 10,
          features: [
            'Real-time object detection',
            'Voice assistance',
            'Haptic feedback',
            'GPS navigation',
            '12-hour battery life'
          ]
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <motion.div 
      className="bg-gray-50 min-h-screen py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Our Products
        </motion.h1>
        
        {loading ? (
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingSpinner size={15} color="#3B82F6" />
            </motion.div>
          </div>
        ) : error ? (
          <motion.div 
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        ) : (
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <StaggerItem key={product._id}>
                  <AnimatedCard delay={index * 0.1}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x300?text=VisionAssist';
                          }}
                        />
                      </motion.div>
                      <div className="p-6 flex-grow">
                        <motion.h2 
                          className="text-xl font-semibold mb-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                        >
                          {product.name}
                        </motion.h2>
                        <motion.p 
                          className="text-gray-600 mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          {product.description.substring(0, 100)}...
                        </motion.p>
                        <div className="flex items-center justify-between mt-auto">
                          <motion.span 
                            className="text-xl font-bold"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            ₹{product.price.toFixed(2)}
                          </motion.span>
                          <div className="space-x-2">
                            <AnimatedButton
                              as={Link}
                              to={`/products/${product._id}`}
                              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition"
                            >
                              Details
                            </AnimatedButton>
                            <AnimatedButton
                              as={Link}
                              to={`/products/${product._id}`}
                              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                            >
                              Buy Now
                            </AnimatedButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}
      </div>
    </motion.div>
  );
};

export default ProductsPage;
