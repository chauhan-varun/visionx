import { Link } from 'react-router-dom';

const ErrorPage = ({ code = 404, message = "Page not found" }) => {
  // Use the correct redirect path based on the error code
  const redirectPath = code === 401 ? "/login" : "/dashboard";
  const buttonText = code === 401 ? "Go to Login" : "Back to Dashboard";
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">{code}</h1>
        <p className="text-xl text-gray-700 mb-6">{message}</p>
        <Link 
          to={redirectPath}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
