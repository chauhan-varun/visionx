import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-9xl font-bold text-accent">404</h1>
        <h2 className="mt-6 text-3xl font-semibold text-text">Page Not Found</h2>
        <p className="mt-2 text-text-secondary">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn-apple px-6 py-3 inline-flex items-center justify-center"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
