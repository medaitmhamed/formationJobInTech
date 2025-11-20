const Profil = ({nom, email, isAdmin}) => {
  return (
    <div style={{marginBottom: '20px'}}>
      <p>Nom : {nom}</p>
      <p>Email : {email}</p>
      {isAdmin && <p style={{color: 'red', fontWeight: 'bold'}}>Admin</p>}
    </div>
  )
}

export default Profil