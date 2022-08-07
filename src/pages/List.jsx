import React, { useEffect, useState } from "react";
import "./less/List.less";
import { List, Skeleton } from "antd";

export default function Lists() {
  const [list, setList] = useState([]);
  return (
    <div className="list_table">
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[
              <a key="list-loadmore-edit">edit</a>,
              <a key="list-loadmore-more">more</a>,
            ]}
          >
            <Skeleton avatar title={false}>
              <List.Item.Meta title={<a href="!#">bt</a>} description="fbt" />
              <div>日期</div>
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
}
