const DeleteBtn = ({handelDelete, user}) => {
  return (
    <button className="delete-btn" onClick={() => handelDelete(user)}>Delete</button>
  )
}

export default DeleteBtn