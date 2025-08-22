import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Users } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  return (
    <div style={{ width: '200px', height: '100vh', backgroundColor: '#f0f0f0', padding: '20px', boxSizing: 'border-box' }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Admin Panel</h3>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '15px' }}>
            <Link to="/admin" style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center' }}>
              <LayoutDashboard size={18} style={{ marginRight: '10px' }} />
              Dashboard
            </Link>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <Link to="/admin/articles" style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center' }}>
              <FileText size={18} style={{ marginRight: '10px' }} />
              Articles
            </Link>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <Link to="/admin/users" style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center' }}>
              <Users size={18} style={{ marginRight: '10px' }} />
              Users
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;