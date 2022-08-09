import React, { useEffect } from "react";
import { useState } from "react";
import { Button, PageHeader, Modal, Form, Input, message } from "antd";
import moment from "moment";
import E from "wangeditor";
import {
  ArticleAddApi,
  ArticleSearchApi,
  ArticleUpdateApi,
} from "../request/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";

let editor;
export default function Edit() {
  const [content, setContent] = useState("");
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const params = useParams();

  const dealData = (res) => {
    setIsModalVisible(false);
    if (res.errCode === 0) {
      message.success(res.message);
      setTimeout(() => {
        navigate("/list");
      }, 1500);
    } else {
      message.error(res.message);
    }
  };
  //对话框点击了提交
  const handleOk = () => {
    //关闭对话框
    form
      .validateFields()
      .then((values) => {
        let { title, subTitle } = values;

        if (params.id) {
          ArticleUpdateApi({ title, subTitle, content, id: params.id }).then(
            (res) => dealData(res)
          );
        } else {
          ArticleAddApi({ title, subTitle, content }).then((res) => {
            dealData(res);
          });
        }
      })
      .catch(() => false);
  };

  //模拟componentDidMount
  useEffect(() => {
    editor = new E("#div1");
    editor.config.onchange = (newHtml) => {
      setContent(newHtml);
    };
    editor.create();
    if (params.id) {
      ArticleSearchApi({ id: params.id }).then((res) => {
        if (res.errCode === 0) {
          let { title, subTitle, content } = res.data;
          editor.txt.html(content);
          setTitle(title);
          setSubTitle(subTitle);
        }
      });
    }
    return () => {
      editor.destroy();
    };
  }, [params.id, location.pathname]);
  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={params.id ? () => window.history.back() : null}
        title="文章编辑"
        subTitle={"当前日期" + moment(new Date()).format("YYYY-MM-DD")}
        extra={
          <Button
            key="1"
            type="primary"
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            提交文章
          </Button>
        }
      ></PageHeader>
      <div
        id="div1"
        style={{ padding: "0 20px 20px", background: "#fff" }}
      ></div>
      <Modal
        okText="提交"
        cancelText="取消"
        zIndex={99999}
        title="填写文章标题"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 3,
          }}
          wrapperCol={{
            span: 21,
          }}
          autoComplete="off"
          initialValues={{ title, subTitle }}
        >
          {" "}
          <Form.Item
            label="标题"
            name="title"
            rules={[
              {
                required: true,
                message: "请填写标题",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="副标题" name="subTitle">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
