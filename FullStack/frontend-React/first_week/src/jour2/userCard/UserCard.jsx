import DeleteBtn from "./DeleteBtn";

const UserCard = ({id, image, name, role, email, handelDelete, selectedUser, handleSelect, children }) => {
  return (
    <>
      {!children ? (
        <div className={`card ${selectedUser === id ? 'selected' : ''}`} onClick={() => handleSelect(id)}>
          <img className="card-image" src={image} alt={name} />
          <h2>{name}</h2>
          <p className="card-role">{role}</p>
          <a href={`mailto:${email}`}>{email}</a>
          <DeleteBtn user={id} handelDelete={handelDelete} />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default UserCard;
