import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Download from './pages/Download';
import ReceiveFile from './pages/ReceiveFile';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/receive" element={<ReceiveFile />} />
        <Route path="/download/:id" element={<Download />} />
      </Routes>
    </Router>
  );
}

export default App;
