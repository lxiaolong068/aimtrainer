import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Game from './pages/Game';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a192f] text-white flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* 游戏模式路由 */}
            <Route path="/play/challenge" element={<Game mode="challenge" />} />
            <Route path="/play/precision" element={<Game mode="precision" />} />
            <Route path="/play/reflex" element={<Game mode="reflex" />} />
            <Route path="/play/moving" element={<Game mode="moving" />} />
            <Route path="/play/tracking" element={<Game mode="tracking" />} />
            <Route path="/play/doubleshot" element={<Game mode="doubleshot" />} />
            {/* 默认游戏模式 */}
            <Route path="/play" element={<Navigate to="/play/challenge" replace />} />
            {/* 页面路由 */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            {/* 重定向所有未匹配的路由到首页 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App