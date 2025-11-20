import useCounter from "./use-counter";

const Counter = () => {
  const { count, increment, decrement, reset } = useCounter();
  return (
    <div className="counter">
      <strong>Count: {count}</strong>
      <div className="button-container">
        <button className="button"  onClick={decrement}>Decrement</button>
        <button className="delete-btn"  onClick={reset}>Reset</button>
        <button className="button"  onClick={increment}>Increment</button>
      </div> 
    </div> 
  )
}

export default Counter