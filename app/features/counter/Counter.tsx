import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount } from './counterSlice'
import { useState } from 'react'

export function Counter() {
  const count = useSelector((state: any) => state.counter.value)
  const dispatch = useDispatch()
  const [amount, setAmount] = useState(0)
  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
        <input type="text" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <button onClick={() => dispatch(incrementByAmount(amount))}>Increment by amount</button>
      </div>
    </div>
  )
}