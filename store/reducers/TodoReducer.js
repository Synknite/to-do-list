// if you want to show initial data :)
const INITIAL_DATA = [];

import {
  ADD_TODO,
  REMOVE_TODO,
  TOGGLE_TODO,
  UPDATE_TODO,
  INIT_TODOS,
} from "../actions/actionsTypes";

const TodoReducer = (state = INITIAL_DATA, action) => {
  switch (action.type) {
    case INIT_TODOS:
      if (action.payload && action.payload.length) {
        return action.payload;
      } else {
        return INITIAL_DATA;
      }
    case ADD_TODO:
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false,
        },
      ];
    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );

    case REMOVE_TODO: {
      console.log(action.id);
      return state.filter((todo) => todo.id !== action.id);
    }

    case UPDATE_TODO:
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, text: action.text } : todo
      );

    default:
      return state;
  }
};

export default TodoReducer;
