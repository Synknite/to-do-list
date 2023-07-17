import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Axios from "axios";

import DefaultLayout from "../../../components/Layout";
import "./index.css";
export default function Register() {
  const onSubmit = async (values) => {
    if (values.password !== values.password2) {
      message.error("Password does not match");
      return;
    }
    try {
      const res = await Axios.post("/api/auth/sign-up", values);
      console.log(res.error);
      if (res.error) {
        message.error(res.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <DefaultLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "120px",
            alignItems: "center",
          }}
        >
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onSubmit}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="password2"
              rules={[
                {
                  required: true,
                  message: "Confirm your password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Confirm password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Register
              </Button>
              Or <a href="/auth/login">login with your account</a>
            </Form.Item>
          </Form>
        </div>
      </div>
    </DefaultLayout>
  );
}
