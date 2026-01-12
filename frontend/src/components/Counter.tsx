import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-8 w-80">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Counter
        </h1>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-8 mb-8">
          <p className="text-6xl font-bold text-white text-center">{count}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={decrement}
            className="flex-1 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-2xl"
          >
            −
          </button>

          <button
            onClick={increment}
            className="flex-1 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-2xl"
          >
            +
          </button>
        </div>

        <button
          onClick={() => setCount(0)}
          className="w-full mt-4 bg-gray-400 hover:bg-gray-500 active:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
