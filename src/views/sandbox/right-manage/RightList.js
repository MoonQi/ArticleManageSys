import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Table, Tag, Tooltip, Modal, Popover, Switch } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";

const { confirm } = Modal;

export default function RightList() {
  const [rightList, setrightList] = useState([]);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      res.data.forEach((element) =>
        element.children?.length === 0
          ? (element.children = null)
          : element.children
      );
      setrightList(res.data);
    });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (route) => {
        return <Tag color="orange">{route}</Tag>;
      },
    },
    {
      title: "权限",
      dataIndex: "pagePermission",
      render: (data) => {
        return data === 1 ? "是" : "否";
      },
    },
    {
      title: "层级",
      dataIndex: "grade",
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
                icon={<DeleteOutlined />}
              />
            </Tooltip>

            <span>&nbsp;&nbsp;&nbsp;</span>
            <Tooltip title="编辑">
              <Popover content={<div style={{textAlign:"center"}}>
                <Switch checked={item.pagePermission} onChange={() => switchMethod(item)}></Switch>
              </div>
              } title='页面配置项' trigger={item.pagePermission!==undefined?'click':''}>
                <Button
                type="primary"
                shape="circle"
                size="small"
                icon={<EditOutlined />}
                disabled={item.pagePermission===undefined}
                />
              </Popover>
              
            </Tooltip>
          </div>
        );
      },
    },
  ];

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
    if (item.grade === 1) {
      setrightList(rightList.filter((data) => data.id !== item.id));
      axios.delete(`/rights/${item.id}`);
    } else {
      let list = rightList.filter((data) => data.id === item.rightId);
      list[0].children = list[0].children.filter((data) => data.id !== item.id);
      // 此处其实就是做了rightList的浅拷贝，下面两句是等价的.
      setrightList([...rightList]);
      // setrightList(rightList.slice());
      axios.delete(`/children/${item.id}`);
    }
  };

  const switchMethod = (item) => {
    item.pagePermission = (1 - item.pagePermission);
    setrightList([...rightList]);
    if(item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagePermission: item.pagePermission,
      });
    }else {
      axios.patch(`/children/${item.id}`, {
        pagePermission: item.pagePermission,
      })
    }
  }
  return (
    <Table
      indentSize={10}
      pagination={{ pageSize: 10 }}
      dataSource={rightList}
      columns={columns}
    />
  );
}
