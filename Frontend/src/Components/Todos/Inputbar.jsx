import { useState } from "react";
import { createTodo, updateTodo } from "../../HandleApi/TodoApiHandler";
import DateTimeDisplay from "./DateTimeDisplay";
import { LoadingSpinner } from "../Loading/LoadingSpinner";

export const Inputbar = ({
  inputRef,
  user,
  items,
  setItems,
  updating,
  setUpdating,
  todoId,
  setUser,
}) => {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    if (inputRef.current.value === "") return;
    setLoading(true);
    if (!task) {
      setLoading(false);
      return;
    }

    // Updation Logic
    if (updating) {
      const updatedItems = items.map((item) => {
        if (item._id === todoId) {
          return { ...item, task };
        }
        return item;
      });
      setItems(updatedItems);
      setUser((prevUser) => ({
        ...prevUser,
        todos: prevUser.todos.map((todo) => {
          if (todo._id === todoId) {
            return { ...todo, task };
          }
          return todo;
        }),
      }));
      setLoading(false);
      setUpdating(false);
      inputRef.current.value = "";
      await updateTodo(todoId, task);
    } else {
      //Create todo
      const updatedItems = [...items];
      const tempId = Date.now().toString();
      const newTodo = {
        _id: tempId,
        task,
        isCompleted: false,
      };
      updatedItems.push(newTodo);
      setItems(updatedItems);
      const updatedUserTodos = [...user.todos, newTodo];
      setUser((prevUser) => ({
        ...prevUser,
        todos: [...prevUser.todos, newTodo],
      }));
      setLoading(false);
      setTask("");
      inputRef.current.value = "";
      const response = await createTodo(task, user, items.length);
      const index = updatedItems.findIndex((item) => item._id === tempId);
      if (index !== -1) {
        updatedItems[index]._id = response.todo._id;
        setItems(updatedItems);
        setUser((prevUser) => ({
          ...prevUser,
          todos: updatedUserTodos.map((todo) =>
            todo._id === tempId ? { ...todo, _id: response.todo._id } : todo
          ),
        }));
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mx-auto w-full text-black md:w-full mb-8">
      <DateTimeDisplay />
      <div className="w-full flex gap-3">
        <input
          ref={inputRef}
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submitHandler();
            }
          }}
          onChange={(e) => setTask(e.target.value)}
          className="px-3 py-2 h-10 flex-1 bg-slate-800 rounded-lg text-white focus:outline-none"
        />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <button
              onClick={submitHandler}
              type="button"
              className="px-6 py-2 font-semibold text-sm md:text-md rounded-md bg-primaryPurple hover:bg-primaryPurple/80 transition-colors text-white"
            >
              {updating ? "Update" : "Add"}
            </button>
            {updating && (
              <button
                onClick={() => {
                  setUpdating(false);
                  inputRef.current.value = "";
                }}
                type="button"
                className="px-4 py-2 font-semibold text-sm md:text-md rounded-md bg-red-700 hover:bg-red-800 transition-colors text-white"
              >
                Cancel
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
