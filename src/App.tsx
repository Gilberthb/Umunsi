import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';

function App() {
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
          <Route path="*" element={<div className="p-8 text-center">Urupapuro ntiruboneka</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
