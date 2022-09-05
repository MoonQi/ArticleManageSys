import { EditOutlined } from "@ant-design/icons";
import { Button, Modal, Table, Tooltip, Tree } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RoleList() {
  const [roleList, setroleList] = useState([]);
  const [rightList, setrightList] = useState([]);
  const [curRights, setcurRights] = useState([]);
  const [curId, setcurId] = useState(0)
  const [isModalVisible, setisModalVisible] = useState(false);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Tooltip title="编辑">
              <Button
                type="primary"
                shape="circle"
                size="small" 
                onClick={() => {
                  setisModalVisible(true);
                  setcurId(item.id);
                  setcurRights(item.rights);
                }}
                icon={<EditOutlined />}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    axios.get("/roles").then((res) => {
      setroleList(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      setrightList(res.data);
    });
  }, []);

  const onCheck = (checkedKeys) => {
    setcurRights(checkedKeys.checked);
  }

  const handleOk = () => {
    setisModalVisible(false);
    // 同步datasource
    setroleList(roleList.map((item) => {
      if(item.id===curId){
        return {
          ...item,
          rights: curRights
        }
      }return item;
    }))
    // axios
    axios.patch(`/roles/${curId}`, {
      rights: curRights
    })
    
  };

  const handleCancel = () => {
    setisModalVisible(false);
  };
  return (
    <div>
      <Table
        indentSize={10}
        pagination={{ pageSize: 10 }}
        rowKey={(item) => item.id}
        dataSource={roleList}
        columns={columns}
      />
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree 
          checkable
          defaultExpandAll={true}
          checkStrictly={true}
          checkedKeys={curRights} 
          onCheck={onCheck}
          treeData={rightList}
        ></Tree>
      </Modal>
    </div>
  );
}
