import React, { forwardRef, useState } from "react";
import { Form, Input, Select } from "antd";

const { Option } = Select;

const UserForm = forwardRef((props, ref) => {
  const {roleId} = JSON.parse(localStorage.getItem("token"));

  const [nickAbled, setnickAbled] = useState(false);
  return (
    <Form ref={ref} layout="vertical" disabled={roleId===3}>
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="nickname"
        label="昵称"
        rules={nickAbled?[]:[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input disabled={nickAbled}/>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Select onSelect={(key) => {
            
            if(key === 1) { 
                setnickAbled(true);
                ref.current.setFieldsValue({
                    nickname: "boss"
                })
            } else{
                setnickAbled(false);
                // ref.current.setFieldsValue({
                //     nickname: undefined
                // })
            }
        }}>
          {props.rolesList.map((item) => (
            <Option value={item.id} key={item.id}>
              {item.roleName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
});
export default UserForm;
