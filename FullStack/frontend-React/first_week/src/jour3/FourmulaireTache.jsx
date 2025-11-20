import { useState } from "react";

function FormulaireTache({ onAdd }) {
  const [texte, setTexte] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (texte.trim() === "") return;
    onAdd(texte);
    setTexte(""); // nettoyer le champ
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nouvelle tâche"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
      />
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default FormulaireTache;
