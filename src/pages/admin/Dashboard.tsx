import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="#" className="block hover:bg-gray-700 px-3 py-2 rounded">Dashboard</a>
            </li>
            <li className="mb-2">
              <a href="#" className="block hover:bg-gray-700 px-3 py-2 rounded">Articles</a>
            </li>
            <li className="mb-2">
              <a href="#" className="block hover:bg-gray-700 px-3 py-2 rounded">Users</a>
            </li>
            <li className="mb-2">
              <a href="#" className="block hover:bg-gray-700 px-3 py-2 rounded">Categories</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        {/* Placeholder Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Articles Overview */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-3">Articles</h3>
            <p>Manage your news articles here.</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">View Articles</button>
          </div>

          {/* Users Overview */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-3">Users</h3>
            <p>Manage registered users.</p>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">View Users</button>
          </div>

          {/* Categories Overview */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-3">Categories</h3>
            <p>Manage article categories.</p>
            <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">View Categories</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;