import { createContext, useReducer, useContext, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item._id === existingItem._id ? action.payload : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
        };
      }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item._id !== action.payload),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const initialState = {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? JSON.parse(localStorage.getItem('paymentMethod'))
      : 'Credit Card',
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  // Save shipping address to localStorage
  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
  }, [state.shippingAddress]);

  // Save payment method to localStorage
  useEffect(() => {
    localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod));
  }, [state.paymentMethod]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        quantity,
      },
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: id,
    });
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Save shipping address
  const saveShippingAddress = (data) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: data,
    });
  };

  // Save payment method
  const savePaymentMethod = (data) => {
    dispatch({
      type: 'SAVE_PAYMENT_METHOD',
      payload: data,
    });
  };

  // Get cart total
  const getCartTotal = () => {
    return state.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Get cart count
  const getCartCount = () => {
    return state.cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
        addToCart,
        removeFromCart,
        clearCart,
        saveShippingAddress,
        savePaymentMethod,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  return useContext(CartContext);
};
