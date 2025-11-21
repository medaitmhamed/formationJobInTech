import { Trash2 } from "lucide-react";

const TodoItem = ({ todo, filter, toggleTodoState, deleteTodo }) => {



  return (
    <div key={todo.id} className="w-1/5 flex gap-4 justify-between items-center">
      <input
        className="done-checkbox"
        type="checkbox"
        checked={todo.fait}
        onChange={() => toggleTodoState(todo.id)}
      />
      <span className={`${filter === "all" ? todo.fait ? "task-done" : "" : ""}`}>{todo.title}</span>
      <button className="py-1 px-2 bg-red-500 text-white rounded-md cursor-pointer" onClick={() => deleteTodo(todo.id)}>
        <Trash2 className="w-5 h-5"/>
      </button>
    </div>
  );
};
export default TodoItem;
