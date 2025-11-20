const TodoItem = ({ todo, filter, toggleTodoState }) => {



  return (
    <div key={todo.id}>
      <input
        className="done-checkbox"
        type="checkbox"
        checked={todo.fait}
        onChange={() => toggleTodoState(todo.id)}
      />
      <span className={`${filter === "all" ? todo.fait ? "task-done" : "" : ""}`}>{todo.title}</span>
    </div>
  );
};
export default TodoItem;
