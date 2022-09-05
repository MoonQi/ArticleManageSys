import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {connect} from 'react-redux'




const { Header } = Layout;

const TopHeader = (props) => {
  let naviagete = useNavigate();
  const [curTime, setcurTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    getTime();
  }, [curTime]);
  const getTime = () => {
    const tick = setInterval(() => {
      setcurTime(new Date().toLocaleTimeString());
      clearInterval(tick);
    }, 1000)
  };
  

  const {role: {roleName}, username, nickname} = JSON.parse(localStorage.getItem("token"));
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: <a>{roleName}</a>,
          disabled: true,
        },
        {
          key: "2",
          danger: true,
          label: "退出登录",
          onClick: () => {
            localStorage.removeItem('token');
            naviagete('/login');
          },
        },
      ]}
    />
  );
    
  const changeCollapsed = () => {
    props.changeCollapsed();
  }

      
  
  

  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {/* {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: "trigger",
        onClick: () => changeCollapsed()
      })} */}
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/> :<MenuFoldOutlined onClick={changeCollapsed}/>
      }
      <div style={{ float: "right" }}>
        <span> 现在是 {curTime}&nbsp;&nbsp;</ span>
        <span>欢迎回来 <span style={{color: '#6cf'}}>{nickname}</span>&nbsp;</span>
        <Dropdown overlay={menu}>
          <Avatar size={"large"} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}

/* 
  connect(mapStateToProps, mapDispatchToProps)(被包装组件)
*/

const mapStateToProps = ({CollapsedReducer}) => {
  return CollapsedReducer;
}

const mapDispatchToProps = {
   changeCollapsed(){
    return {
      type:"change_collapsed"
    }
   }
}



export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)