import { useEffect, useState } from "react"

const ClickCounter = () => {
    const [count, setState] = useState(0);
    useEffect(() => {
          document.title = `Clicks: ${count}`;
        }, [count]);
        return (
    <div className="counter">
        <p>cliquer pour incrémenter le compteur de clics (voire le titre de la page)</p>
      <button className="button" onClick={() => setState(prev => prev + 1)}>Click</button>
    </div> 
  )
}

export default ClickCounter