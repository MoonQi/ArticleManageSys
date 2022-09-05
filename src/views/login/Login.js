import { Form, Input, Checkbox, Button, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import PaticleScreen from "../../components/login/PaticleScreen";
import axios from "axios";

import "./login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  let navigate = useNavigate();
  const onFinish = (values) => {
    axios
      .get(
        `/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`
      )
      .then(async(res) => {
        if(res.data.length > 0) {
          
          await localStorage.setItem("token", JSON.stringify(res.data[0]));
          navigate('/');
        }else{
          message.error('用户名或密码不匹配！');
        }
      })
      .catch((err) => {
        console.log("!!!" + err);
      });
  };

  return (
    <div className="background">
      <PaticleScreen />
      <div className="formContianer">
        <div className="formTitle">关卡发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="unchecked" noStyle>
              <Checkbox defaultChecked={false} style={{ color: "aliceblue" }}>Remember me</Checkbox>
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
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
