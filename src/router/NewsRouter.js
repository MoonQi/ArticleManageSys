import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes,   } from "react-router-dom";
import AddArticle from "../views/sandbox/article-manage/AddArticle";
import Home from "../views/sandbox/home/Home";
import Nopermission from "../views/sandbox/nopermission/Nopermission";
import RightList from "../views/sandbox/right-manage/RightList";
import RoleList from "../views/sandbox/right-manage/RoleList";
import UserList from "../views/sandbox/user-manage/UserList";
import axios from "axios";
import { Spin } from "antd";
import { connect } from "react-redux";
import Nprogress from 'nprogress';
import 'nprogress/nprogress.css'

const LocalRouterMap = {
  "/home": <Home />,
  "/user-manage/list": <UserList />,
  "/right-manage/role/list": <RoleList />,
  "/right-manage/right/list": <RightList />,
  "/article-manage/add": <AddArticle />,
};

const NewsRouter = (props) =>  {
  const [routeList, setrouteList] = useState([]);
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    Promise.all([axios.get("/rights"), axios.get("/children")]).then((res) => {
      setrouteList([...res[0].data, ...res[1].data]);
    });
  }, []);

  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && item.pagePermission;
  };

  const checkUserRights = (item) => {
    return rights.includes(item.key);
  };

  Nprogress.start();
  useEffect(() => {
    Nprogress.done();
  })
  

  return (
    <Spin size="large" spinning={props.isLoading}>
      <Routes>
        {routeList.map((item) => {
          if (checkRoute(item) && checkUserRights(item))
            return (
              <Route
                path={item.key}
                element={LocalRouterMap[item.key]}
                key={item.key}
              />
            );
          else return null;
        })}
        <Route path="/" element={<Navigate replace from="/" to="home" />} />
        {routeList.length > 0 && <Route path="/*" element={<Nopermission />} />}
      </Routes>
    </Spin>
  );
}

const mapStateToProps = ({LoadingReducer}) => {
  return LoadingReducer;
}

const mapDispatchToProps = {
   changeLoading(){
    return {
      type:"change_loading"
    }
   }
}


export default connect(mapStateToProps, mapDispatchToProps)(NewsRouter) 