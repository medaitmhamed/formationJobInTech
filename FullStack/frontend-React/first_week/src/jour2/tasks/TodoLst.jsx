import { useState } from "react";
import TodoItem from "./todoItem";

const TodoLst = () => {
  const INITIAL_TACHES = [
    { id: 1, title: "Faire les courses", fait: false },
    { id: 2, title: "Faire le ménage", fait: true },
    { id: 3, title: "Apprendre React", fait: false },
  ];
  const [tasks, setTasks] = useState(INITIAL_TACHES);
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(false);

  const filterTasks = 
    filter === "all"
      ? tasks
      : filter === "completed"
      ? tasks.filter((todo) => todo.fait)
      : tasks.filter((todo) => !todo.fait);

  const toggleTodoState = (id) => {
    setTasks(
      tasks.map((todo) =>
        todo.id === id ? { ...todo, fait: !todo.fait } : todo
      )
    );
  };
  return (
    <div className={`todo-lst-container ${dark ? "dark" : ""}`}>
      <h1 className="todo-lst-title">Liste des tâches</h1>
      <div className="filter-bar">
        <div className="filter-btns">
          <button className={`${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>Toutes</button>
          <button className={`${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>Complétées</button>
          <button className={`${filter === "uncompleted" ? "active" : ""}`} onClick={() => setFilter("uncompleted")}>
            Non complétées
          </button>
        </div>
        <button className="button theme-btn" onClick={() => setDark(!dark)}>
          {dark ? "Light" : "Dark"}
        </button>
      </div>
      <div className="todo-lst">
        {filterTasks.map((todo) => (
          <TodoItem todo={todo} filter={filter} toggleTodoState={toggleTodoState} />
        ))}
      </div>
    </div>
  );
};

export default TodoLst;
