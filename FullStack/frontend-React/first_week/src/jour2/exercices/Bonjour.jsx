const Bonjour = () => {

  return (
    <div>
        <p>{new Date().getHours()<12 ? 'Bonjour' : 'Bonsoir'}</p>
    </div>
  )
}

export default Bonjour
