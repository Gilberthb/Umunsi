import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Images from './pages/Images';
import Religion from './pages/Religion';
import Music from './pages/Music';
import Entertainment from './pages/Entertainment';
import Login from './pages/Login';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import Articles from './pages/admin/Articles';
import Users from './pages/admin/Users';
import Analytics from './pages/admin/Analytics';
import Logs from './pages/admin/Logs';
import Settings from './pages/admin/Settings';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes with Layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/images" element={<Images />} />
                <Route path="/religion" element={<Religion />} />
                <Route path="/music" element={<Music />} />
                <Route path="/tv" element={<div className="p-8 text-center">Urupapuro rwa Televiziyo ruzakorwa vuba</div>} />
                <Route path="/movies" element={<div className="p-8 text-center">Urupapuro rw'Amashusho ruzakorwa vuba</div>} />
                <Route path="/sports" element={<div className="p-8 text-center">Urupapuro rwa Siporo ruzakorwa vuba</div>} />
                <Route path="/politics" element={<div className="p-8 text-center">Urupapuro rwa Politiki ruzakorwa vuba</div>} />
                <Route path="/health" element={<div className="p-8 text-center">Urupapuro rw'Ubuzima ruzakorwa vuba</div>} />
                <Route path="/entertainment" element={<Entertainment />} />
                <Route path="/celebrity" element={<div className="p-8 text-center">Urupapuro rw'Abakinnyi ruzakorwa vuba</div>} />
                <Route path="/article/:id" element={<div className="p-8 text-center">Urupapuro rw'inkuru ruzakorwa vuba</div>} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </Layout>
          } />
          
          {/* Admin routes with AdminLayout */}
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="articles" element={<Articles />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="logs" element={<Logs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;