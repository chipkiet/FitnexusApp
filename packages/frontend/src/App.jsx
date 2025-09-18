import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
    const [message, setMessage] = useState('Loading...')

    useEffect(() => {
        // Test connection to backend
        axios.get('http://localhost:3001')
            .then(response => {
                setMessage(response.data.message)
            })
            .catch(error => {
                setMessage('Error connecting to backend: ' + error.message)
            })
    }, [])

    return (
        <div className="flex items-center justify-center h-screen bg-slate-800">
            <h1 className="text-3xl font-bold text-sky-400">
                {message}
            </h1>
        </div>
    )
}

export default App