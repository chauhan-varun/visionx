import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-blue-400">Vision</span>Device
            </h3>
            <p className="text-gray-400 mb-4">
              Bringing vision to the blind through innovative technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.235.6 1.8 1.165.565.565.914 1.132 1.166 1.8.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.166 1.8c-.565.565-1.132.914-1.8 1.166-.636.247-1.363.416-2.427.465-1.024.048-1.379.06-4.12.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.8-1.166 4.902 4.902 0 01-1.166-1.8c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-4.12v-.08c0-2.643.013-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.166-1.8 4.902 4.902 0 011.8-1.166c.636-.247 1.363-.416 2.427-.465C9.516 2.013 9.871 2 12.315 2zm.001 9.999a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0 6.5a9 9 0 110-18 9 9 0 010 18zm5.5-11a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Careers</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Press</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Contact Us</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Help Center</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">FAQs</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Warranty</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Accessibility</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} VisionX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
