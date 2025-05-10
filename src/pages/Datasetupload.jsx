import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

const DatasetUpload = () => {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length || !title || !description || !price) {
      setError('Please fill all fields and select at least one file or folder');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You need to login first');
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError('');
      setSuccess('');

      const xhr = new XMLHttpRequest();

      xhr.open('POST', 'https://data-marketplace-backend-production.up.railway.app/api/datasets', true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        if (xhr.status === 201) {
          setSuccess('Dataset uploaded successfully!');
          setTitle('');
          setDescription('');
          setPrice('');
          setFiles([]);
        } else {
          const response = JSON.parse(xhr.responseText);
          setError(response.error || 'Upload failed');
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        setError('Upload failed due to a network error');
      };

      xhr.send(formData);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      setError('Failed to upload dataset');
    }
  };

  return (
    <div className="relative max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-300">
      {/* Uploading overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex flex-col items-center justify-center rounded-lg">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl mb-3" />
          <p className="text-gray-700 font-medium mb-2">Uploading... {uploadProgress}%</p>
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Upload Dataset</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Dataset Name</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isUploading}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isUploading}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows="4"
          ></textarea>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            disabled={isUploading}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload Dataset File</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            required
            multiple
            webkitdirectory="true"
            disabled={isUploading}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full mt-6 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none disabled:opacity-60"
        >
          Upload Dataset
        </button>
      </form>
    </div>
  );
};

export default DatasetUpload;
