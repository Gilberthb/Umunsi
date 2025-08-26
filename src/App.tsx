import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import AdminLayout from '/home/user/Umunsi/src/components/layout/AdminLayout';
import AdminDashboard from '/home/user/Umunsi/src/pages/admin/AdminDashboard';
import Articles from '/home/user/Umunsi/src/pages/admin/Articles';
import Users from '/home/user/Umunsi/src/pages/admin/Users';

function App() { // Changed to use BrowserRouter instead of Router
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Additional routes will be added here */}
          <Route path="/tv" element={<div className="p-8 text-center">Urupapuro rwa Televiziyo ruzakorwa vuba</div>} />
          <Route path="/movies" element={<div className="p-8 text-center">Urupapuro rw'Amashusho ruzakorwa vuba</div>} />
          <Route path="/music" element={<div className="p-8 text-center">Urupapuro rw'Umuziki ruzakorwa vuba</div>} />
          <Route path="/sports" element={<div className="p-8 text-center">Urupapuro rwa Siporo ruzakorwa vuba</div>} />
          <Route path="/politics" element={<div className="p-8 text-center">Urupapuro rwa Politiki ruzakorwa vuba</div>} />
          <Route path="/health" element={<div className="p-8 text-center">Urupapuro rw'Ubuzima ruzakorwa vuba</div>} />
          <Route path="/entertainment" element={<div className="p-8 text-center">Urupapuro rw'Ibikorwa ruzakorwa vuba</div>} />
          <Route path="/celebrity" element={<div className="p-8 text-center">Urupapuro rw'Abakinnyi ruzakorwa vuba</div>} />
          <Route path="/article/:id" element={<div className="p-8 text-center">Urupapuro rw'inkuru ruzakorwa vuba</div>} />
          {/* Admin Dashboard Route */}
        </Routes>
      </Layout>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="articles" element={<Articles />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
