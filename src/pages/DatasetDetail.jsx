import { useNavigate, useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; 

const DatasetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [purchaseStats, setPurchaseStats] = useState({
    totalPurchases: 0,
    lastHourPurchases: 0
  });
  

  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token); 
      userId = decoded.id;
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }

  useEffect(() => {
    const fetchDatasetDetails = async () => {
      try {
        const [datasetRes, statsRes] = await Promise.all([
          fetch(`data-marketplace-backend-production.up.railway.app/api/datasets/${id}`),
          fetch(`data-marketplace-backend-production.up.railway.app/api/datasets/${id}/stats`)
        ]);
  
        const datasetData = await datasetRes.json();
        const statsData = await statsRes.json();
  
        setDataset(datasetData);
        setPurchaseStats(statsData);  // 👈 new
      } catch (err) {
        console.error('Error fetching dataset or stats:', err);
        setMessage('Failed to load dataset details.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchDatasetDetails();
  
    const blockKeys = (e) => {
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && ['s', 'p', 'u'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        alert('Screenshot and download are disabled in view mode.');
      }
    };
  
    document.addEventListener('keydown', blockKeys);
    return () => document.removeEventListener('keydown', blockKeys);
  }, [id]);
  
  const handlePurchase = async () => {
    if (!token || !userId) {
      setMessage('Please log in to make a purchase.');
      return;
    }

    setIsPurchasing(true);
    try {
      const res = await fetch(`data-marketplace-backend-production.up.railway.app/api/payment/razorpay/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.orderId) {
        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          order_id: data.orderId,
          name: 'Micrologic Data Marketplace',
          description: dataset.title,
          handler: function (response) {
            completePurchase(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
          },
          prefill: {
            name: 'User',
            email: 'user@example.com',
            contact: '8589833019',
          },
          theme: { color: '#F37254' },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        setMessage('Failed to initiate payment. Please try again.');
      }
    } catch (err) {
      console.error('Error during payment initiation:', err);
      setMessage('Failed to initiate the payment.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const completePurchase = async (paymentId, orderId, signature) => {
    if (!token || !userId) {
      setMessage('Please log in to complete the purchase.');
      return;
    }

    try {
      const res = await fetch(`data-marketplace-backend-production.up.railway.app/api/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentId, orderId, signature }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Purchase completed successfully!');
        setIsPaid(true);

        await fetch('data-marketplace-backend-production.up.railway.app/api/purchases/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, datasetId: id }),
        });
      } else {
        setMessage('Payment verification failed.');
      }
    } catch (err) {
      console.error('Error during payment verification:', err);
      setMessage('Error verifying payment.');
    }
  };



  const handleDownload = () => {
    if (!isPaid || !token || !userId) {
      setMessage('You need to complete the payment and be logged in to download.');
      return;
    }

    setIsDownloading(true);
    window.open(
      `data-marketplace-backend-production.up.railway.app/api/datasets/${id}/download?userId=${userId}`,
      '_blank'
    );
    setIsDownloading(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-indigo-600 hover:text-indigo-800 inline-flex items-center transition-colors"
      >
        ← Back to Datasets
      </button>
  
      {/* Dataset Info Section */}
      <section className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{dataset.title}</h1>
        <p className="text-gray-700 mb-3">{dataset.description}</p>
        <p className="text-2xl font-semibold text-indigo-600">₹{dataset.price}</p>
      </section>
  
      {/* Purchase Stats */}
      <section className="mb-6 text-sm text-gray-600">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <p>
            <span className="font-medium text-gray-800">Total Purchases:</span>{' '}
            {purchaseStats.totalPurchases}
          </p>
          <p>
            <span className="font-medium text-gray-800">Purchases in Last Hour:</span>{' '}
            {purchaseStats.lastHourPurchases}
          </p>
        </div>
      </section>
  
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isPaid
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
          }`}
          onClick={handlePurchase}
          disabled={isPurchasing || isPaid}
        >
          {isPurchasing
            ? 'Processing Purchase...'
            : isPaid
            ? 'Purchase Completed'
            : 'Purchase'}
        </button>
  
        {isPaid && (
          <button
            className="px-6 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download Dataset'}
          </button>
        )}
      </div>
  
      {/* Message Feedback */}
      {message && (
        <div className="mt-4 text-sm text-green-800 bg-green-100 p-4 rounded-lg border border-green-200">
          {message}
        </div>
      )}
    </div>
  );
  
  
};

export default DatasetDetail;
