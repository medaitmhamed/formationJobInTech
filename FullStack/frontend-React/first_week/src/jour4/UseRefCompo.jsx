import { useRef } from "react";

const UseRefCompo = () => {
  const inputRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`vous avez tappe: ${inputRef.current.value}`);
  };
  return (
    <div className="use_ref">
      <h2 style={{ color: "#1a1a1a" }}>UseRefCompo</h2>
      <form action="" onSubmit={handleSubmit}>
        <div>
          <input
            ref={inputRef}
            className="input-controller"
            type="text"
            placeholder="ecrire quelque chose"
          />
          <button
            className="btn-controller "
            type="button"
            onClick={() => inputRef.current.focus()}
          >
            Focus
          </button>
          <br />
        </div>
        <button className="btn-controller " type="submit">
          Afficher la valeur
        </button>
      </form>
    </div>
  );
};

export default UseRefCompo;
