import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  RiArrowLeftLine,
  RiFileDownloadLine,
  RiMailLine,
  RiMapPinLine,
  RiShoppingBag3Line,
  RiShoppingCartLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiTruckLine,
  RiUserLine,
  RiMoneyDollarCircleLine,
} from 'react-icons/ri';
import api from '../api/apiClient';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        // In a real scenario, you would fetch from your API
        // const { data } = await api.get(`/admin/orders/${id}`);
        
        // Simulated data for demonstration
        setTimeout(() => {
          const mockOrder = {
            _id: id,
            user: {
              _id: 'usr105',
              name: 'John Doe',
              email: 'johndoe@example.com',
              phone: '+91 98765 43210'
            },
            orderItems: [
              {
                _id: 'item1',
                name: 'VisionAssist Pro',
                qty: 1,
                price: 1299.99,
                image: 'https://placehold.co/300x300/e3e3e3/0071e3?text=VisionAssist+Pro',
                subtotal: 1299.99
              },
              {
                _id: 'item2',
                name: 'Vision Lens Kit',
                qty: 2,
                price: 149.99,
                image: 'https://placehold.co/300x300/e3e3e3/5ac8fa?text=Vision+Lens+Kit',
                subtotal: 299.98
              }
            ],
            shippingAddress: {
              address: '123 Tech Lane',
              city: 'New Delhi',
              postalCode: '110001',
              country: 'India'
            },
            paymentMethod: 'Credit Card',
            paymentResult: {
              id: 'txn_123456789',
              status: 'COMPLETED',
              update_time: new Date().toISOString(),
              email_address: 'johndoe@example.com'
            },
            itemsPrice: 1599.97,
            taxPrice: 288.00,
            shippingPrice: 50.00,
            totalPrice: 1937.97,
            isPaid: true,
            paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            isDelivered: Math.random() > 0.5,
            deliveredAt: Math.random() > 0.5 ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() : null,
            status: Math.random() > 0.5 ? 'Delivered' : 'Processing',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Customer requested gift wrapping'
          };
          
          setOrder(mockOrder);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      
      // In a real scenario:
      // await api.put(`/admin/orders/${id}/status`, { status: newStatus });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrder(prevOrder => ({
        ...prevOrder,
        status: newStatus,
        isDelivered: newStatus === 'Delivered',
        deliveredAt: newStatus === 'Delivered' ? new Date().toISOString() : prevOrder.deliveredAt
      }));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <RiCheckboxCircleLine className="text-success" />;
      case 'Processing':
        return <RiTimeLine className="text-amber-500" />;
      case 'Shipped':
        return <RiTruckLine className="text-accent" />;
      case 'Pending Payment':
        return <RiMoneyDollarCircleLine className="text-error" />;
      default:
        return <RiShoppingCartLine className="text-text-secondary" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/orders" className="p-2 rounded-full hover:bg-gray-100">
            <RiArrowLeftLine className="w-5 h-5 text-text-secondary" />
          </Link>
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-text">Order not found</h2>
        <p className="text-text-secondary mt-2">The order you're looking for doesn't exist or has been removed.</p>
        <Link to="/orders" className="mt-6 inline-block btn-apple">
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <Link 
            to="/orders" 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Back to Orders"
          >
            <RiArrowLeftLine className="w-5 h-5 text-text-secondary" />
          </Link>
          <h1 className="text-2xl font-semibold text-text">Order #{order._id}</h1>
          <span className={`status-badge ${
            order.status === 'Delivered' ? 'success' :
            order.status === 'Pending Payment' ? 'error' : 'pending'
          }`}>
            {getStatusIcon(order.status)}
            <span className="ml-1">{order.status}</span>
          </span>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center">
            <RiFileDownloadLine className="mr-2" /> Invoice
          </button>
          <button className="btn-apple flex items-center">
            <RiMailLine className="mr-2" /> Email Customer
          </button>
        </div>
      </div>
      
      <div className="text-sm text-text-secondary">
        <span>Placed on {formatDate(order.createdAt)}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-text flex items-center">
                <RiShoppingBag3Line className="mr-2" /> Items Ordered
              </h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {order.orderItems.map((item) => (
                <div key={item._id} className="p-6 flex items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-text">{item.name}</h3>
                    <div className="text-sm text-text-secondary mt-1">
                      {formatCurrency(item.price)} x {item.qty}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-text">{formatCurrency(item.subtotal)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-text flex items-center">
                <RiUserLine className="mr-2" /> Customer Information
              </h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-text mb-2">Contact Information</h3>
                <div className="text-text-secondary space-y-1">
                  <p className="flex items-start">
                    <RiUserLine className="mr-2 mt-0.5" /> {order.user.name}
                  </p>
                  <p className="flex items-start">
                    <RiMailLine className="mr-2 mt-0.5" /> {order.user.email}
                  </p>
                  {order.user.phone && (
                    <p className="flex items-start">
                      <svg className="mr-2 mt-0.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {order.user.phone}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-text mb-2">Shipping Address</h3>
                <div className="text-text-secondary space-y-1">
                  <p className="flex items-start">
                    <RiMapPinLine className="mr-2 mt-0.5" />
                    <span>
                      {order.shippingAddress.address}, {order.shippingAddress.city},<br />
                      {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Update Order Status */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-text">Update Order Status</h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                {['Processing', 'Shipped', 'Delivered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updating || order.status === status}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium focus:outline-none ${
                      order.status === status
                        ? 'bg-accent text-white cursor-default'
                        : 'bg-gray-100 text-text hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              
              {order.notes && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-border">
                  <h3 className="font-medium text-text mb-2">Order Notes</h3>
                  <p className="text-text-secondary">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-text">Order Summary</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal:</span>
                  <span className="text-text font-medium">{formatCurrency(order.itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Tax:</span>
                  <span className="text-text">{formatCurrency(order.taxPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Shipping:</span>
                  <span className="text-text">{formatCurrency(order.shippingPrice)}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="text-text font-medium">Total:</span>
                  <span className="text-text font-semibold">{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-text">Payment Information</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-text mb-1">Payment Method</h3>
                <p className="text-text-secondary">{order.paymentMethod}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-text mb-1">Payment Status</h3>
                <div className="flex items-center">
                  <span className={`status-badge ${order.isPaid ? 'success' : 'error'}`}>
                    {order.isPaid ? 'Paid' : 'Not Paid'}
                  </span>
                  {order.isPaid && (
                    <span className="ml-2 text-text-secondary text-sm">
                      on {formatDate(order.paidAt)}
                    </span>
                  )}
                </div>
              </div>
              
              {order.isPaid && order.paymentResult && (
                <div>
                  <h3 className="font-medium text-text mb-1">Transaction Details</h3>
                  <p className="text-text-secondary">
                    ID: {order.paymentResult.id}
                  </p>
                  <p className="text-text-secondary">
                    Status: {order.paymentResult.status}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-text">Delivery Information</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-text mb-1">Delivery Status</h3>
                <div className="flex items-center">
                  <span className={`status-badge ${order.isDelivered ? 'success' : 'pending'}`}>
                    {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                  </span>
                  {order.isDelivered && (
                    <span className="ml-2 text-text-secondary text-sm">
                      on {formatDate(order.deliveredAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
