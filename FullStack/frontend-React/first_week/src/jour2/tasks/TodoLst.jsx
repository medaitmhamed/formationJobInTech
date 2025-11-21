import { useRef, useState } from "react";
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
  const taskRef = useRef(null);

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
  const addTodo = (e, title) => {
    e.preventDefault();
    setTasks([...tasks, { id: tasks.length + 1, title, fait: false }]);
    taskRef.current.value = "";
  };
  const deleteTodo = (id) => {
    setTasks(tasks.filter((todo) => todo.id !== id));
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
        <button className="mb-1 py-1 px-6 bg-gray-500 text-white rounded-md cursor-pointer" onClick={() => setDark(!dark)}>
          {dark ? "Light" : "Dark"}
        </button>
      </div>
      <div className="w-full py-5 px-10 ">
        <form action="" className="flex gap-4">
          <input ref={taskRef} className="w-full py-2 px-4 border border-gray-300 rounded-md" type="text" placeholder="Ajouter une tâche" />
          <button className="py-2 px-4 bg-blue-500 text-white rounded-md" onClick={(e) => addTodo(e,taskRef.current.value)}>Ajouter</button>
        </form>
      </div>
      <div className="todo-lst">
        {filterTasks.map((todo) => (
          <TodoItem todo={todo} filter={filter} toggleTodoState={toggleTodoState} deleteTodo={deleteTodo} />
        ))}
      </div>
    </div>
  );
};

export default TodoLst;
