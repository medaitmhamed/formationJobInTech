import useLocalStorage from "./use-local-storage"

const Theme = () => {
    const [theme , setTheme] = useLocalStorage("them","Light");
  return (
    <div style={{margin: 'auto'}}>
        <select className="button" value={theme} onChange={(e)=>setTheme(e.target.value)}>
            <option >Light</option>
            <option >Dark</option>
        </select>
    </div>
  )
}

export default Theme