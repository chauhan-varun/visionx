import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide image URL'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be positive'],
    },
    countInStock: {
      type: Number,
      required: [true, 'Please provide count in stock'],
      min: [0, 'Count in stock must be positive'],
      default: 0,
    },
    features: [String],
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
