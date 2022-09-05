import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Switch, Table, Button, Modal, Tooltip } from "antd";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import UserForm from "../../../components/user-manage/UserForm";

const { confirm } = Modal;

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [updateVisible, setupdateVisible] = useState(false);
  const [rolesList, setRolesList] = useState([]);
  const [curUser, setcurUser] = useState(null)
  const [refresh, setrefresh] = useState(false);
  const addForm = useRef(null);
  const updateForm = useRef(null);

  const {roleId, username} = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    axios.get("/roles").then((res) => {
      setRolesList(res.data);
    });
  }, []);
  useEffect(() => {
    axios.get("/users?_expand=role").then((res) => {
      const fullList = res.data;
      setUserList(roleId===1?fullList:[
        ...fullList.filter(item=>item.username===username),
        ...fullList.filter(item=>item.roleId===3)
      ]);
    });
  }, [refresh, roleId, username]);
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "昵称",
      dataIndex: "nickname",
    },
    {
      title: "角色名称",
      dataIndex: "role",
      value: "roleId",
      filters: rolesList.map((item) => {
        return ({
          text: item.roleName,
          value: item.id,
        });
      }),

      onFilter: (value, item) => item.roleId === value,
      render: (role) => {
        return role.roleName;
      },
    },
    {
      title: "用户状态",
      render: (item) => {
        return (
          <Switch
            checked={item.roleState}
            disabled={item.default}
            onChange={() => changeState(item)}
          ></Switch>
        );
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Tooltip title="删除">
              <Button
                danger
                type="primary"
                shape="circle"
                size="small"
                onClick={() => confirmMethod(item)}
                disabled={item.default}
                icon={<DeleteOutlined />}
              />
            </Tooltip>

            <span>&nbsp;&nbsp;&nbsp;</span>
            <Tooltip title="编辑">
              <Button
                type="primary"
                shape="circle"
                size="small"
                onClick={() => {handleUpdate(item)}}
                icon={<EditOutlined />}
                disabled={item.default}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const changeState = (item) => {
    item.roleState = !item.roleState;
    axios
      .patch(`/users/${item.id}`, {
        roleState: item.roleState,
      })
      .then(() => {
        setUserList([...userList]);
      });
  };

  // 同步防错，如果这里没有await，那么会报updateForm为null的问题
  const handleUpdate = async(item) => {
    setcurUser(item);
    await setupdateVisible(true);
    updateForm.current.setFieldsValue(item);
  }

  const updateUser = () => {
    updateForm.current
      .validateFields()
      .then((res) => {
        // 先post到后端生成id，再刷新页面list状态
        axios
          .patch(`/users/${curUser.id}`, {
            ...res,

          })
          .then(res => {
            updateForm.current.resetFields();
            setrefresh(!refresh);
            setAddFormVisible(false); 
          });
      })
      .catch((err) => {});
    setupdateVisible(false);
    

  }

  const confirmMethod = (item) => {
    confirm({
      title: "你确定要删除这个页面吗？",
      icon: <ExclamationCircleOutlined />,
      content: "",
      onOk() {
        deleteMethod(item);
      },
      onCancel() {},
    });
  };

  const deleteMethod = (item) => {
    // 当前页面同步状态 + 后端同步
    axios.delete(`/users/${item.id}`).then(setrefresh);
  };

  const addUser = () => {
    addForm.current
      .validateFields()
      .then((res) => {
        // 先post到后端生成id，再刷新页面list状态
        axios.post(`/users`, {
            ...res,
            roleState: true,
            default: false,
          })
          .then(res => {
            addForm.current.resetFields();
            setrefresh(!refresh);
            setAddFormVisible(false);
          });
      })
      .catch((err) => {});
  };

  return (
    <div>
      <Button
        title="添加新用户"
        type="primary"
        onClick={() => {
          setAddFormVisible(true);
        }}
      >
        添加新用户
      </Button>
      <Table
        style={{ marginTop: "10px" }}
        columns={columns}
        dataSource={userList}
        rowKey={(item) => item.id}
      />
      <Modal
        visible={addFormVisible}
        title="添加新用户"
        okText="Create"
        cancelText="Cancel"
        onCancel={() => {
          setAddFormVisible(false);
        }}
        onOk={() => {addUser();}}
      >
        <UserForm rolesList={rolesList} ref={addForm} />
      </Modal>
      <Modal
        visible={updateVisible}
        title="更新用户"
        okText="Create"
        cancelText="Cancel"
        onCancel={() => {
          setupdateVisible(false);
        }}
        onOk={updateUser}
      >
        <UserForm rolesList={rolesList} ref={updateForm} />
      </Modal>
    </div>
  );
}
