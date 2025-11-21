import { useState } from "react";

const ValidateEmpty = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const validateEmail = (e) => {
        e.preventDefault();
        setEmail("");
        if (!email.trim()) {
            setMessage("email requis");
        } else {
            setMessage("Email envoyé");
        }       
    }
  return (
    <div className="validate_empty">
        <h2 style={{color: "#1a1a1a"}}>Vérifier si le champ est vide</h2>
        <form action="" onSubmit={validateEmail}>
            <input className="input-controller" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
            <button className="btn-controller " type="submit">Envoyer</button>
        </form>
        <p style={{color: message === "email requis" ? "red" : "green"}}>{message}</p>
    </div>
  )
}

export default ValidateEmpty
