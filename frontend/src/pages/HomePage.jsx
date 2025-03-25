import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FadeIn, SlideInLeft, SlideInRight, AnimatedButton } from '../components/animations/AnimatedElements';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-gray-900 text-white py-20 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <SlideInLeft>
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Bringing Vision to the Blind
              </motion.h1>
              <motion.p 
                className="text-xl mb-8 text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Our revolutionary device uses cutting-edge technology to help visually impaired individuals perceive the world around them in new ways.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <AnimatedButton as={Link} to="/products" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition duration-300">
                  Learn More
                </AnimatedButton>
                <AnimatedButton as={Link} to="/products" className="bg-white hover:bg-gray-100 text-blue-900 font-semibold py-3 px-6 rounded-lg text-center transition duration-300">
                  Buy Now
                </AnimatedButton>
              </motion.div>
            </div>
          </SlideInLeft>
          <SlideInRight>
            <div className="md:w-1/2">
              <motion.div 
                className="bg-gray-800 rounded-lg p-2 shadow-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <img 
                  src="https://www.pmu.edu.sa/Attachments/Academics/Images/UDP/CCES/Smart-Glasses-For-Blind-People-img1.PNG" 
                  alt="Smart glasses for visually impaired people" 
                  className="w-full h-auto rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x400?text=Vision+Device';
                  }}
                />
              </motion.div>
            </div>
          </SlideInRight>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            Revolutionary Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -10, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
            >
              <motion.div 
                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold text-center mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Real-time Object Detection
              </motion.h3>
              <motion.p 
                className="text-gray-600 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Identifies objects and people in the environment with advanced AI technology.
              </motion.p>
            </motion.div>
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -10, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
            >
              <motion.div 
                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold text-center mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Haptic Feedback
              </motion.h3>
              <motion.p 
                className="text-gray-600 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                Translates visual information into intuitive tactile sensations.
              </motion.p>
            </motion.div>
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -10, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
            >
              <motion.div 
                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold text-center mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                Voice Assistant
              </motion.h3>
              <motion.p 
                className="text-gray-600 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                Describes surroundings and reads text with natural language processing.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            Transforming Lives
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeIn delay={0.1}>
              <motion.div 
                className="bg-gray-50 p-6 rounded-lg shadow"
                whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="w-12 h-12 bg-blue-500 rounded-full mr-4"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  ></motion.div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-gray-500 text-sm">Using VisionX for 2 years</p>
                  </div>
                </div>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  "This device has completely changed how I navigate the world. I can now identify objects, read text, and recognize faces with confidence."
                </motion.p>
              </motion.div>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <motion.div 
                className="bg-gray-50 p-6 rounded-lg shadow"
                whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="w-12 h-12 bg-blue-500 rounded-full mr-4"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  ></motion.div>
                  <div>
                    <h4 className="font-semibold">Michael Torres</h4>
                    <p className="text-gray-500 text-sm">Using VisionX for 1 year</p>
                  </div>
                </div>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  "As someone who lost their sight later in life, this technology has helped me regain independence I thought was gone forever."
                </motion.p>
              </motion.div>
            </FadeIn>
            
            <FadeIn delay={0.5}>
              <motion.div 
                className="bg-gray-50 p-6 rounded-lg shadow"
                whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="w-12 h-12 bg-blue-500 rounded-full mr-4"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  ></motion.div>
                  <div>
                    <h4 className="font-semibold">Dr. Emily Chen</h4>
                    <p className="text-gray-500 text-sm">Ophthalmologist</p>
                  </div>
                </div>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  "I recommend this device to my patients with visual impairments. The technology is groundbreaking and the results are remarkable."
                </motion.p>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            Ready to Experience the Difference?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join thousands of users who have transformed their lives with our revolutionary vision technology.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/products" className="inline-block bg-white hover:bg-gray-100 text-blue-900 font-semibold py-3 px-8 rounded-lg transition duration-300">
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
