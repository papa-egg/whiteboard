import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Whiteboard from './components/whiteboard/Whiteboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Whiteboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
