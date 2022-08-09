import React, { useEffect } from "react";
import { useState } from "react";
import { Button, PageHeader, Modal, Form, Input } from "antd";
import moment from "moment";
import E from "wangeditor";
import { ArticleAddApi } from "../request/api";

let editor;
export default function Edit() {
  const [content, setContent] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  //对话框点击了提交
  const handleOk = () => {
    //关闭对话框
    // setIsModalVisible(false);
    form
      .validateFields()
      .then((values) => {
        // form.resetFields();
        let { title, subTitle } = values;
        ArticleAddApi({ title, subTitle, content }).then((res) => {});
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
    return () => {
      editor.destroy();
    };
  }, []);
  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
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
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
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
