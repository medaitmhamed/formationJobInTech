import { useState } from "react";
import UserCard from "./UserCard";

const UsersList = () => {
  const usersLst = [
    {
      id: 1,
      name: "Sara",
      image: "https://randomuser.me/api/portraits/women/70.jpg",
      role: "Graphic designer",
      email: "sara@example.com",
    },
    {
      id: 2,
      name: "Zineb",
      image: "https://randomuser.me/portraits/women/44.jpg",
      role: "Full Stack Developer",
      email: "zineb@example.com",
    },
    {
      id: 3,
      name: "Alex",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
      role: "DevOps Engineer",
      email: "alex@example.com",
    },
  ];

  const [users, setUsers] = useState(usersLst);
  const [selectedUser, setSelectedUser] = useState(null);

  const handelDelete = (id) => {
    const newUsers = users.filter((user) => user.id !== id);
    setUsers(newUsers);
  }
  const handleSelect = (id) => {
    const user = users.find((user) => user.id === id);
      if(user === selectedUser) {
        setSelectedUser(null);
        return;
      }
      setSelectedUser(id);
      console.log(
        `
        nom: ${user.name}
        role: ${user.role}
        email: ${user.email}
        `
      );
      
  }
  return (
    <div>
      <h1 className="title">Cartes de profil</h1>
          <UserCard>
            <p className="subtitle">
              {users.length === 0
              ? "Aucun utilisateur n'est inscrit sur Votre plateforme."
              : `Il y a ${users.length} utilisateurs inscrits sur Votre plateforme.`
              }
            </p>
          </UserCard>
      <div className="users-list">
        {users.map((user) => (
          <UserCard
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            role={user.role}
            email={user.email}
            handelDelete={handelDelete}
            selectedUser={selectedUser}
            handleSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default UsersList;

<component>
  <p className="title">
    Voici la liste des utilisateurs inscrits sur notre plateforme.
  </p>
</component>;
