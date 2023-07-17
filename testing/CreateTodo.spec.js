import { render, screen, fireEvent } from "@testing-library/react";
import { useDispatch } from "react-redux";
import "@jest-dom/jest-dom";
import { CreateTodo } from "../components/CreateTodo";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

describe("CreateTodo", () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatchMock);
    render(<CreateTodo />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component", () => {
    expect(screen.getByText("Create Todos")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Create todo here")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Todo" })
    ).toBeInTheDocument();
  });

  test("dispatches addTodo action when Add Todo button is clicked", () => {
    const addTodoButton = screen.getByRole("button", { name: "Add Todo" });
    const todoInput = screen.getByPlaceholderText("Create todo here");

    fireEvent.change(todoInput, { target: { value: "New Todo" } });
    fireEvent.click(addTodoButton);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: "ADD_TODO",
      payload: "New Todo",
    });
  });

  test("does not dispatch any action when todoText is empty and Add Todo button is clicked", () => {
    const addTodoButton = screen.getByRole("button", { name: "Add Todo" });

    fireEvent.click(addTodoButton);

    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
