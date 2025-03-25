import { BeatLoader } from 'react-spinners';

const LoadingSpinner = ({ size = 15, color = '#3B82F6', loading = true }) => {
  return (
    <div className="flex justify-center items-center py-4">
      <BeatLoader size={size} color={color} loading={loading} />
    </div>
  );
};

export default LoadingSpinner;
