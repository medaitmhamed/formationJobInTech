import { useState } from "react";

const ControlledInput = () => {
    const [firstName, setFirstName] = useState("");
    const [message, setMessage] = useState("");
  return (
    <div className="controll_input">
        <h1 className="title text-red-500">ControlledInput</h1>
        <h2>Bonjour <i>{firstName || "inconnu"}</i>, ton message et <i>{message || "(aucun message)"}</i></h2>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prénom"/>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message"/>
    </div>
  )
}

export default ControlledInput;