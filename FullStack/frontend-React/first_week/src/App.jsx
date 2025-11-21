// import { useState } from "react";
// import jobInTechLogo from "/jobInTech.png";
// import laptopBg from "./assets/laptopBg.png";
import Welcome from "./jour1/components/Welcome";
import "./App.css";
import Header from "./jour1/components/Header";
import ProductList from "./jour1/components/ProductList";
import Footer from "./jour1/components/Footer";
import UsersList from "./jour2/userCard/UsersList";
import Bonjour from "./jour2/exercices/Bonjour";
import Notifications from "./jour2/exercices/Notifications";
import Profil from "./jour2/exercices/Profil";
import TodoLst from "./jour2/tasks/todoLst";
import Counter from "./jour3/Counter";
import ClickCounter from "./jour3/ClickCounter";
import Timer from "./jour3/Timer";
import Theme from "./jour3/Theme";
import Panier from "./jour3/Panier";
import ControlledInput from "./jour4/ControlledInput";
import ValidateEmpty from "./jour4/validateEmpty";
import UseRefCompo from "./jour4/UseRefCompo";
import UserDirectory from "./mini-projet - Annuaire dutilisateurs/UserDirectory";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div id="app">
      {/* ------------------   Jour 4  ----------------------  */}
      <UserDirectory />
      <ControlledInput />
      <ValidateEmpty />
      <UseRefCompo />
      {/* ------------------   Jour 3  ----------------------  */}
      <Counter />
      <ClickCounter />
      <Timer/>
      <Theme/>
      <Panier/>
      {/* ------------------   Jour 2  ----------------------  */}
      <div>
        <UsersList />
      </div>

      {/* ===================   liste de tâches  ===================  */}
      <div>
        <TodoLst />
      </div>



      {/* ===================   Exercices  ===================  */}
      <div className="exercices_container">
        <h1 className="title">Exercices</h1>
        <h2 className="exercice_title">Exercice 1 : Bonjour</h2>
        <Bonjour />

        <h2 className="exercice_title">Exercice 2 : Notifications</h2>
        <strong>
          <i>appel Notifications avec les notifications suivantes :</i>{" "}
        </strong>
        <Notifications
          notifications={["Notification 1", "Notification 2", "Notification 3"]}
        />
        <strong>
          <i>appel Notifications sans notifications :</i>{" "}
        </strong>
        <Notifications notifications={[]} />

        <h2 className="exercice_title">Exercice 3 : Profil</h2>
        <strong>
          <i>Profil Admin :</i>
        </strong>
        <Profil nom="Med" email="med@example.com" isAdmin={true} />
        <strong>
          <i>Profil Utilisateur :</i>
        </strong>
        <Profil nom="Med" email="med@example.com" isAdmin={false} />
      </div>

      {/* ===================   Jour 1  ======================*/}
      {/* <Header />
      <ProductList />
      <Footer /> */}
      {/* <div>
        <Welcome name="Med" />
        <div>
          <a href="https://react.dev" target="_blank">
            <img src={jobInTechLogo} className="logo react" alt="React logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={laptopBg} className="logo react" alt="React logo" />
          </a>
        </div>
        <UserCard name="Med" role="Full Stack Developer" email="med@example.com" />
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <button id="reset-btn" onClick={() => setCount(0)}>
            Reset
          </button>
        </div>
      </div> */}
    </div>
  );
}

export default App;
