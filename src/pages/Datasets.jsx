import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Datasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`data-marketplace-backend-production.up.railway.app/api/datasets?search=${search}`)
      .then((res) => res.json())
      .then((data) => setDatasets(data));
  }, [search]);

  return (
    <div className="p-6 max-w-screen-xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        🔍 Explore Datasets
      </h1>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search datasets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {datasets.length === 0 ? (
        <div className="text-center text-gray-500">
          No datasets found. Try a different keyword.
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {datasets.map((ds) => (
            <div
              key={ds.id}
              onClick={() => navigate(`/dashboard/datasets/${ds.id}`)}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-transform cursor-pointer border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {ds.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {ds.description?.slice(0, 100)}...
              </p>
              <p className="text-green-600 font-semibold text-lg">₹{ds.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Datasets;
