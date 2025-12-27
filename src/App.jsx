import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import HeritagePage from './HeritagePage'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <HeritagePage />
    </div>
  )
}

export default App
