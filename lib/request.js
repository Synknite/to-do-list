import Axios from "axios";

export const createTodo = async (text) => {
  const res = await Axios.post("/api/todos/create", { text });
  if (!res.error && res.data.success) {
    return { result: res.data.todo };
  }
  return { error: res.error };
};

export const changeTodo = async ({ id, text, completed }) => {
  const res = await Axios.put("/api/todos/update", { id, text, completed });
  if (!res.error) {
    return { result: res.data };
  } else {
    return { error: res.error };
  }
};

export const removeTodo = async (id) => {
  const res = await Axios.delete(`api/todos/remove/${id}`);
  return { result: true };
};

export const getTodos = async () => {
  const res = await Axios.get("api/todos");
  if (!res.error) {
    return { result: res.data };
  } else {
    return { error: res.error };
  }
};
