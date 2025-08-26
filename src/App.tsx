import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Images from './pages/Images';
import Religion from './pages/Religion';
import Music from './pages/Music';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import Articles from './pages/admin/Articles';
import Users from './pages/admin/Users';

function App() {
  return (
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
              <Route path="/entertainment" element={<div className="p-8 text-center">Urupapuro rw'Ibikorwa ruzakorwa vuba</div>} />
              <Route path="/celebrity" element={<div className="p-8 text-center">Urupapuro rw'Abakinnyi ruzakorwa vuba</div>} />
              <Route path="/article/:id" element={<div className="p-8 text-center">Urupapuro rw'inkuru ruzakorwa vuba</div>} />
            </Routes>
          </Layout>
        } />
        
        {/* Admin routes with AdminLayout */}
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="articles" element={<Articles />} />
              <Route path="users" element={<Users />} />
            </Routes>
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;