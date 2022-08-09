import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import {
  ReadOutlined,
  EditOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { useState } from "react";

export default function Aside() {
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultKey, setDefaultKey] = useState("");

  //一般加个空数组就是为了模仿componentDidMounted
  useEffect(() => {
    let path = location.pathname;
    let key = path.split("/")[1];
    setDefaultKey(key);
  }, [location.pathname]);

  const handleClick = (e) => {
    navigate("/" + e.key);
    setDefaultKey(e.key);
  };

  return (
    <Menu
      onClick={handleClick}
      style={{ width: 160 }}
      selectedKeys={[defaultKey]}
      mode="inline"
      className="aside"
      theme="dark"
    >
      <Menu.Item key="list">
        <ReadOutlined />
        查看文章列表
      </Menu.Item>
      <Menu.Item key="edit">
        <EditOutlined />
        文章编辑
      </Menu.Item>
      <Menu.Item key="means">
        <DatabaseOutlined />
        修改资料
      </Menu.Item>
    </Menu>
  );
}
