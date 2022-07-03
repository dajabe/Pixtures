import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import Canvas from './Canvas'

export default function App() {
  return (
    <div className="container">
      <Header />
      <Sidebar />
      <Canvas />
    </div>
  )
}
