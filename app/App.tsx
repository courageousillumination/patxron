import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Creator } from "./pages/Creator";
import { Home } from "./pages/Home";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/creator/:address" element={<Creator />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
