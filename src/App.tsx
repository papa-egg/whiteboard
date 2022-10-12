import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import WhiteboardConponent from './components/whiteboard/WhiteboardConponent'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WhiteboardConponent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
