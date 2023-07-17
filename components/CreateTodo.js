import React, { useState } from "react";
import "../public/static/sass/CreateTodo.css";
import { Row, Col, Input, Button, message } from "antd";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { addTodo } from "../store/actions/actionCreator";
import { PlusCircleOutlined } from "@ant-design/icons";
import { createTodo } from "../lib/request";

export const CreateTodo = (props) => {
  const dispatch = useDispatch();
  const [todoText, setTodoText] = useState("");

  const onChangeTodoText = (e) => {
    setTodoText(e.target.value);
  };

  const onAddTodo = async () => {
    if (!todoText) return;
    const { result, error } = await createTodo(todoText);
    if (!error) {
      dispatch(addTodo(result));
    } else {
      message.error(error);
    }
    setTodoText("");
  };
  const onCancel = () => setTodoText("");

  return (
    <div className="create-todo">
      <Row gutter={[16, 16]} justify="center" align="middle">
        <h1>Create Todos</h1>
      </Row>
      <Row gutter={[16, 16]} justify="center" align="middle">
        <Col span={8}>
          <Input
            placeholder="Create todo here"
            value={todoText}
            onChange={onChangeTodoText}
          ></Input>
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={onAddTodo}
          >
            Add Todo
          </Button>
          <Button
            danger
            type="primary"
            className="button-margin"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </div>
  );
};
