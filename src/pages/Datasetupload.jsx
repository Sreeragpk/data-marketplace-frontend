// import React, { useState } from 'react';

// const DatasetUpload = () => {
//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Handle file change
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file || !title || !description || !price) {
//       setError('Please fill all fields and select a file');
//       return;
//     }

//     const token = localStorage.getItem('token'); // Retrieve JWT token from storage
//     if (!token) {
//       setError('You need to login first');
//       return;
//     }

//     // Create FormData object to send the file and other fields
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('price', price);

//     try {
//       // Sending request with JWT token for authentication
//       const res = await fetch('https://data-marketplace-backend-production.up.railway.app/api/datasets', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData, // FormData containing file and other fields
//       });

//       const data = await res.json();

//       if (res.status === 201) {
//         setSuccess('Dataset uploaded successfully!');
//         setError('');
//       } else {
//         setError(data.error || 'Error uploading dataset');
//         setSuccess('');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Failed to upload dataset');
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-semibold text-center mb-6">Upload Dataset</h2>

//       {/* Error/Success message display */}
//       {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//       {success && <p className="text-green-500 text-center mb-4">{success}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="title" className="block text-sm font-medium text-gray-700">Dataset Name</label>
//           <input
//             type="text"
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//             className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         <div>
//           <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//             className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           ></textarea>
//         </div>

//         <div>
//           <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
//           <input
//             type="number"
//             id="price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             required
//             className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>

//         <div>
//           <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload Dataset File</label>
//           <input
//             type="file"
//             id="file"
//             onChange={handleFileChange}
//             required
//             className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           Upload Dataset
//         </button>
//       </form>
//     </div>
//   );
// };

// export default DatasetUpload;




import React, { useState } from 'react';

const DatasetUpload = () => {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle file change (including folder upload)
  const handleFileChange = (e) => {
    setFiles(e.target.files); // Multiple files selected when folder is uploaded
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length || !title || !description || !price) {
      setError('Please fill all fields and select at least one file or folder');
      return;
    }

    const token = localStorage.getItem('token'); // Retrieve JWT token from storage
    if (!token) {
      setError('You need to login first');
      return;
    }

    // Create FormData object to send the file(s) and other fields
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file)); // Append each file

    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);

    try {
      // Sending request with JWT token for authentication
      const res = await fetch('https://data-marketplace-backend-production.up.railway.app/api/datasets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // FormData containing files and other fields
      });

      const data = await res.json();

      if (res.status === 201) {
        setSuccess('Dataset uploaded successfully!');
        setError('');
      } else {
        setError(data.error || 'Error uploading dataset');
        setSuccess('');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload dataset');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-300">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Upload Dataset</h2>

      {/* Error/Success message display */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dataset Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Dataset Name</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
          ></textarea>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload Dataset File</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            required
            multiple // Allow multiple files from folder
            webkitdirectory // Allow folder upload
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Upload Dataset
        </button>
      </form>
    </div>
  );
};

export default DatasetUpload;

