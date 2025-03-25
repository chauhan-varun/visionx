import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  RiArrowRightLine, 
  RiEyeLine, 
  RiShoppingBag3Line, 
  RiUserLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiMoneyDollarCircleLine
} from 'react-icons/ri';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import api from '../api/apiClient';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newUsers: 0,
    recentOrders: []
  });

  // Chart options and data
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        titleColor: '#1d1d1f',
        bodyColor: '#1d1d1f',
        borderColor: '#d2d2d7',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          labelPointStyle: () => ({
            pointStyle: 'circle',
            rotation: 0
          })
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#86868b'
        }
      },
      y: {
        grid: {
          color: 'rgba(210, 210, 215, 0.3)'
        },
        ticks: {
          color: '#86868b'
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Sales',
        data: [18, 25, 21, 35, 41, 37, 56],
        borderColor: '#0071e3',
        backgroundColor: 'rgba(0, 113, 227, 0.1)',
        fill: 'origin'
      },
      {
        label: 'Users',
        data: [12, 19, 25, 29, 32, 35, 40],
        borderColor: '#5ac8fa',
        backgroundColor: 'rgba(90, 200, 250, 0.1)',
        fill: 'origin'
      }
    ]
  };

  const doughnutChartData = {
    labels: ['VisionAssist Pro', 'Vision Lens Kit', 'Extended Warranty'],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: ['#0071e3', '#5ac8fa', '#34c759'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        titleColor: '#1d1d1f',
        bodyColor: '#1d1d1f',
        borderColor: '#d2d2d7',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6
      }
    },
    cutout: '70%'
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real scenario, you would fetch actual data from your API
        // const { data } = await api.get('/admin/dashboard');
        // setStats(data);
        
        // Simulated data for demonstration
        setStats({
          totalUsers: 248,
          totalOrders: 159,
          totalRevenue: 259845.99,
          newUsers: 24,
          recentOrders: [
            {
              _id: 'ord12345',
              user: {
                _id: 'usr123',
                name: 'John Doe'
              },
              totalPrice: 1299.99,
              isPaid: true,
              createdAt: '2025-03-22T10:30:00.000Z',
              status: 'Delivered'
            },
            {
              _id: 'ord12346',
              user: {
                _id: 'usr124',
                name: 'Jane Smith'
              },
              totalPrice: 1449.98,
              isPaid: true,
              createdAt: '2025-03-23T14:45:00.000Z',
              status: 'Processing'
            },
            {
              _id: 'ord12347',
              user: {
                _id: 'usr125',
                name: 'Mike Johnson'
              },
              totalPrice: 99.99,
              isPaid: true,
              createdAt: '2025-03-24T09:15:00.000Z',
              status: 'Shipped'
            },
            {
              _id: 'ord12348',
              user: {
                _id: 'usr126',
                name: 'Sarah Williams'
              },
              totalPrice: 1299.99,
              isPaid: false,
              createdAt: '2025-03-25T11:20:00.000Z',
              status: 'Pending Payment'
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        // Simulate loading for smoother animations
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text">Dashboard</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card h-32">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat-card stagger-item">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-secondary text-sm font-medium">Total Users</span>
              <div className="p-2 bg-blue-50 rounded-full">
                <RiUserLine className="h-5 w-5 text-accent" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-text mb-1">{stats.totalUsers}</h3>
            <div className="flex items-center text-sm">
              <RiArrowUpLine className="mr-1 text-success" />
              <span className="text-success">+{stats.newUsers}</span>
              <span className="text-text-secondary ml-2">since last month</span>
            </div>
          </div>
          
          <div className="stat-card stagger-item">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-secondary text-sm font-medium">Total Orders</span>
              <div className="p-2 bg-indigo-50 rounded-full">
                <RiShoppingBag3Line className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-text mb-1">{stats.totalOrders}</h3>
            <div className="flex items-center text-sm">
              <RiArrowUpLine className="mr-1 text-success" />
              <span className="text-success">+12.5%</span>
              <span className="text-text-secondary ml-2">since last month</span>
            </div>
          </div>
          
          <div className="stat-card stagger-item">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-secondary text-sm font-medium">Total Revenue</span>
              <div className="p-2 bg-green-50 rounded-full">
                <RiMoneyDollarCircleLine className="h-5 w-5 text-success" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-text mb-1">{formatCurrency(stats.totalRevenue)}</h3>
            <div className="flex items-center text-sm">
              <RiArrowUpLine className="mr-1 text-success" />
              <span className="text-success">+18.2%</span>
              <span className="text-text-secondary ml-2">since last month</span>
            </div>
          </div>
          
          <div className="stat-card stagger-item">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-secondary text-sm font-medium">Page Views</span>
              <div className="p-2 bg-amber-50 rounded-full">
                <RiEyeLine className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-text mb-1">24,562</h3>
            <div className="flex items-center text-sm">
              <RiArrowDownLine className="mr-1 text-error" />
              <span className="text-error">-3.6%</span>
              <span className="text-text-secondary ml-2">since last month</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text">Sales Analytics</h3>
              <div className="bg-gray-100 rounded-md text-sm">
                <select className="bg-transparent px-3 py-1 border-none focus:ring-0 text-text-secondary">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
            </div>
            {loading ? (
              <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
            ) : (
              <div className="animate-fade-in">
                <Line options={lineChartOptions} data={lineChartData} height={120} />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text">Product Distribution</h3>
            </div>
            
            {loading ? (
              <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
            ) : (
              <div className="animate-fade-in">
                <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text">Recent Orders</h3>
          <Link 
            to="/orders"
            className="text-accent hover:text-accent-hover text-sm font-medium flex items-center"
          >
            View All <RiArrowRightLine className="ml-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="apple-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, index) => (
                  <tr key={order._id} className={`stagger-item`}>
                    <td className="font-medium">#{order._id}</td>
                    <td>{order.user.name}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{formatCurrency(order.totalPrice)}</td>
                    <td>
                      <span className={`status-badge ${
                        order.status === 'Delivered' ? 'success' :
                        order.status === 'Pending Payment' ? 'error' : 'pending'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-accent hover:text-accent-hover text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
