import {useState} from 'react'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <h1 className="text-3xl font-bold text-purple-600">
                Tailwind 3.4.1 + Vite + React ✅
            </h1>
        </>
    )
}

export default App
