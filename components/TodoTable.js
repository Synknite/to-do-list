import React, { useContext, useState, useEffect, useRef } from "react";

import { connect, useDispatch, useSelector } from "react-redux";
import {
  deleteTodo,
  toggleTodo,
  updateTodo,
  setVisibilityFilter,
  initTodos,
} from "../store/actions/actionCreator";
import {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE,
} from "../store/actions/actionsTypes";

import { changeTodo, getTodos, removeTodo } from "../lib/request";

import { Tabs, Table, Row, Col, Button, Input, Popconfirm, Form } from "antd";
import { CheckOutlined, MinusOutlined } from "@ant-design/icons";
const { TabPane } = Tabs;

import "../public/static/sass/TodoTable.css";
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const getVisibleTodos = (todos, filter) => {
  console.log(filter);
  switch (filter) {
    case SHOW_ALL:
      return todos;
    case SHOW_COMPLETED:
      return todos.filter((t) => t.completed);
    case SHOW_ACTIVE:
      return todos.filter((t) => !t.completed);
    default:
      return todos;
  }
};

export const TodoTable = () => {
  const dispatch = useDispatch();
  const { todos } = useSelector((state) => state);
  const filter = useSelector((state) => state.visibilityFilter);
  useEffect(() => {
    getTodos().then(({ result: todos }) => {
      dispatch(initTodos(todos));
    });
  }, [dispatch]);
  const visibleTodos = getVisibleTodos(todos, filter);
  const handleSave = async (record) => {
    try {
      const { result } = await changeTodo(record);
      console.log(result);
      dispatch(updateTodo(result));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { result } = await removeTodo(id);
      if (result) {
        dispatch(deleteTodo(id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (record) => {
    try {
      const { result, error } = await changeTodo({
        ...record,
        completed: !record.completed,
      });
      if (!error) {
        dispatch(toggleTodo(result.id));
      }
    } catch (error) {
      // message.error(error);
    }
  };

  const tabKeyToActionType = (key) => {
    switch (key) {
      case "1":
        dispatch(setVisibilityFilter(SHOW_ALL));
        return;
      case "2":
        dispatch(setVisibilityFilter(SHOW_COMPLETED));
        return;
      case "3":
        dispatch(setVisibilityFilter(SHOW_ACTIVE));
        return;
      default:
        throw new Error("Unknown filter key: " + key);
    }
  };
  const cells = [
    {
      title: "Todos",
      dataIndex: "text",
      width: "80%",
      editable: true,
      render: (text, row) => (
        <span
          style={{
            textDecoration: row.completed ? "line-through" : "none",
            color: row.completed ? "gray" : "black",
          }}
        >
          {text}
          {row.completed ? "(completed)" : ""}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (text, record) =>
        visibleTodos.length >= 1 ? (
          <div>
            <Button
              shape="circle"
              icon={<CheckOutlined />}
              className="action-button"
              onClick={() => handleToggle(record)}
            />

            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button shape="circle" icon={<MinusOutlined />} />
            </Popconfirm>
          </div>
        ) : null,
    },
  ];
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = cells.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <div className="todo-table">
      <Row gutter={[16, 16]} justify="center" align="middle">
        <Tabs onChange={tabKeyToActionType} type="card">
          <TabPane tab="All" key="1" />
          <TabPane tab="Completed" key="2" />
          <TabPane tab="Active" key="3" />
        </Tabs>
      </Row>
      <Row gutter={[16, 16]} justify="center" align="middle">
        <Col span={12}>
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={visibleTodos}
            columns={columns}
            rowKey={(todo) => todo.id}
          />
        </Col>
      </Row>
    </div>
  );
};
