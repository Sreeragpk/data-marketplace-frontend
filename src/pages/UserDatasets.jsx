import React, { useEffect, useState } from 'react';
import { FaDownload, FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing FontAwesome icons

const UserDatasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchUserDatasets = async () => {
    try {
      const res = await fetch('data-marketplace-backend-production.up.railway.app/api/datasets/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDatasets(data);
    } catch {
      setError('Failed to load datasets');
    }
  };

  const deleteDataset = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dataset?')) return;
    await fetch(`data-marketplace-backend-production.up.railway.app/api/datasets/user/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUserDatasets();
  };

  const startEditing = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };
  const saveEdit = async () => {
    await fetch(`data-marketplace-backend-production.up.railway.app/api/datasets/${editingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitle }),
    });
    setEditingId(null);
    setEditTitle('');
    fetchUserDatasets();
  };

  const downloadDataset = (id) => {
    window.open(`data-marketplace-backend-production.up.railway.app/api/download/${id}`, '_blank');
  };

  useEffect(() => {
    fetchUserDatasets();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Uploaded Datasets</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Title</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {datasets.map(ds => (
              <tr key={ds.id} className="hover:bg-gray-50 transition duration-200">
                <td className="px-6 py-4 text-sm text-gray-700">{ds.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {editingId === ds.id ? (
                    <input
                      type="text"
                      className="border rounded-md p-2 w-full text-gray-700"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                    />
                  ) : (
                    ds.title
                  )}
                </td>
                <td className="px-6 py-4 space-x-4">
                  {editingId === ds.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        className="text-green-600 hover:text-green-800 flex items-center transition duration-200"
                      >
                        <FaEdit className="mr-2" /> Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-800 flex items-center transition duration-200"
                      >
                        <FaEdit className="mr-2" /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(ds.id, ds.title)}
                        className="text-blue-600 hover:text-blue-800 flex items-center transition duration-200"
                      >
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button
                        onClick={() => deleteDataset(ds.id)}
                        className="text-red-600 hover:text-red-800 flex items-center transition duration-200"
                      >
                        <FaTrashAlt className="mr-2" /> Delete
                      </button>
                      <button
                        onClick={() => downloadDataset(ds.id)}
                        className="text-purple-600 hover:text-purple-800 flex items-center transition duration-200"
                      >
                        <FaDownload className="mr-2" /> Download
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDatasets;
