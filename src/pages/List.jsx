import React, { useEffect, useState } from "react";
import { List, Button, Skeleton, Pagination } from "antd";
import { ArticleListApi } from "../request/api";
import moment from "moment";
import "./less/List.less";
import { useNavigate } from "react-router-dom";

export default function Lists() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [current, setCorrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //请求封装
  const getList = (num) => {
    ArticleListApi({
      num,
      count: pageSize,
    }).then((res) => {
      if (res.errCode === 0) {
        let { arr, total, num, count } = res.data;
        setList(arr);
        setTotal(total);
        setCorrent(num);
        setPageSize(count);
      }
    });
  };

  //请求列表数据
  useEffect(() => {
    getList(current);
  }, []);

  const onChange = (pages) => {
    getList(pages);
  };

  return (
    <div className="list_table" style={{ padding: "20px" }}>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                type="primary"
                onClick={() => navigate("/edit/" + item.id)}
              >
                编辑
              </Button>,
              <Button type="danger" onClick={() => console.log(item.id)}>
                删除
              </Button>,
            ]}
          >
            <Skeleton loading={false} title={false}>
              <List.Item.Meta
                title={
                  <a href={"http://codesohigh.com:8765/article/" + item.id}>
                    {item.title}
                  </a>
                }
                description={item.subTitle}
              />
              <div>{moment(item.date).format("YYYY-MM-DD hh:mm:ss")}</div>
            </Skeleton>
          </List.Item>
        )}
      />
      <Pagination
        style={{ float: "right", marginTop: "20px" }}
        onChange={onChange}
        total={total}
        current={current}
        pageSize={pageSize}
      />
    </div>
  );
}
