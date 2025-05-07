import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const PurchasedDatasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch(
          `data-marketplace-backend-production.up.railway.app/api/purchases/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setDatasets(data);
      } catch (err) {
        console.error("Error fetching purchased datasets:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) fetchPurchases();
  }, [userId, token]);

  const handleDownload = (datasetId) => {
    window.open(
      `data-marketplace-backend-production.up.railway.app/api/datasets/${datasetId}/download?userId=${userId}`,
      "_blank"
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📦 Your Purchased Datasets
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading your purchased datasets...</p>
      ) : datasets.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center text-gray-500">
          You haven't purchased any datasets yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {dataset.title}
                </h2>
                <p className="text-gray-600 text-sm">{dataset.description}</p>
              </div>
              <button
                onClick={() => handleDownload(dataset.id)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition-colors duration-200"
              >
                ⬇️ Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchasedDatasets;
