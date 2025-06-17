import React from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route 
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Feedback from "./pages/Feedback";

import "./assets/design.css";

function App() {
  return(
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
}

export default App;
