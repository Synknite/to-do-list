import {
  ADD_TODO,
  REMOVE_TODO,
  TOGGLE_TODO,
  SET_VISIBILITY_FILTER,
  UPDATE_TODO,
  INIT_TODOS,
} from "./actionsTypes";

let ToDoId = 3;

export const addTodo = (todo) => ({
  type: ADD_TODO,
  ...todo,
});

export const deleteTodo = (id) => ({
  type: REMOVE_TODO,
  id: id,
});

export const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  id: id,
});

export const updateTodo = (todo) => ({
  type: UPDATE_TODO,
  id: todo.id,
  text: todo.text,
});

export const setVisibilityFilter = (filter) => ({
  type: SET_VISIBILITY_FILTER,
  filter,
});

export const initTodos = (todos) => ({
  type: INIT_TODOS,
  payload: todos,
});
