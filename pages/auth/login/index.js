import React from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Axios from "axios";
import DefaultLayout from "../../../components/Layout";
import "./index.css";

export default function Login() {
  const router = useRouter();
  const onSubmit = async (values) => {
    try {
      const res = await Axios.post("/api/auth/sign-in", values);
      if (!res.error && res.data.success) {
        router.push("/todos");
      }
    } catch (error) {
      console.log({ error });
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
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              Or <a href="/auth/register">register now!</a>
            </Form.Item>
          </Form>
        </div>
      </div>
    </DefaultLayout>
  );
}
