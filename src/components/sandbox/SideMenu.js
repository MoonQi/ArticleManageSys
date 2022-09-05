import {
  UserOutlined,
  VideoCameraOutlined,
  HomeOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { OmitProps } from "antd/lib/transfer/ListBody";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import './index.css'

const { Sider } = Layout;

const iconList = {
  "/home": <HomeOutlined />,
  "/user-manage" : <UserOutlined />,
  "/right-manage": <AuditOutlined />,
  "/level-manage" : <VideoCameraOutlined />
}

const SideMenu = (props) => {
  let navigate = useNavigate();
  let location = useLocation();
  const {role: {rights}} = JSON.parse(localStorage.getItem("token"));

  const checkPermission = (element) => {return element.pagePermission===1 && rights.includes(element.key)}
  const createMenu = (menuList) => {
    return menuList.map((element) => {
      if(checkPermission(element)) {
        if (element.children?.length > 0) {
          return {
            key: element.key,
            label: element.title,
            icon: iconList[element.key],
            children: createMenu(element.children),
          };
        } else {
          return {
            key: element.key,
            label: element.title,
            onClick: () => {
              navigate(element.key);
            },
            icon: iconList[element.key],
          };
        }
      }else return false;
    });
  };
  const [menu, setmenu] = useState([]);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      const menu = createMenu(res.data)
      setmenu(menu);
      // console.log(menu);  

    });
  }, []);
  // 此处可以看到hook生命周期的区别
  // console.log(menu);


  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{display: 'flex', height:'100%', flexDirection: 'column'}}>
        {
          !props.isCollapsed && <div className="logo">关卡信息发布系统</div>
        }
        {/* <div className="logo" display={props.isCollapsed?'none':'inline'}>关卡信息发布系统</div> */}
        <div style={{flex:1, overflow: 'auto'}}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            defaultOpenKeys={['/'+location.pathname.split('/')[1]]}
            items={menu}
          />
        </div>
      </div>
      
    </Sider>
  );
}


const mapStateToProps = ({CollapsedReducer}) => {
  return CollapsedReducer;
}



export default connect(mapStateToProps)(SideMenu);
