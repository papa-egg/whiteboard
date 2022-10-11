import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Whiteboard from './components/Whiteboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/whiteboard" element={<Whiteboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
