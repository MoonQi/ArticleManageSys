import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";


import './NewsSandBox.css'
import NewsRouter from "../../router/NewsRouter";

export default function NewsSandBox() { 
  
  return (
    <Layout>
      <SideMenu ></SideMenu>
      <Layout className= 'site-layout'>
        <TopHeader ></TopHeader>
        <Content
          className='site-layout'
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
        <NewsRouter />
        </Content>
        
      </Layout>
      
    </Layout>
  );
}
