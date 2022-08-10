import React, { useEffect } from "react";
import { Button, Form, Input, message, Upload } from "antd";
import { GetUserDataApi, ChangeUserDataApi } from "../request/api";
import "./less/Means.less";
import { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

//将图片转换base64
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
//限制图片大小
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }

  const isLt2M = file.size / 1024 / 1024 / 1024 < 200;

  if (!isLt2M) {
    message.error("请上传小于200KB的图片!");
  }

  return isJpgOrPng && isLt2M;
};

export default function Means() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    GetUserDataApi().then((res) => {
      if (res.errCode === 0) message.success(res.message);
      sessionStorage.setItem("username", res.data.username);
    });
  }, []);

  //表单提交的时间
  const onFinish = (values) => {
    console.log(values);
    if (
      values.username &&
      values.username !== sessionStorage.getItem("username") &&
      values.password.trim() !== ""
    ) {
      //做表单的提交
      ChangeUserDataApi({
        username: values.username,
        password: values.password,
      }).then((res) => {
        console.log(res);
      });
    }
  };

  //点击上传图片
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
        localStorage.setItem("avatar", info.file.response.data.filePath);
      });
    }
  };
  //上传按钮
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <div className="means">
      <Form
        style={{ width: "400px" }}
        name="basic"
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="修改用户名："
          name="username"
          rules={[{ message: "用户名不能为空!" }]}
        >
          <Input placeholder="请输入新用户名" />
        </Form.Item>

        <Form.Item label="修 改 密 码：" name="password">
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" style={{ float: "right" }}>
            提交
          </Button>
        </Form.Item>
      </Form>
      <p>点击下方修改头像</p>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        headers={{ "cms-token": localStorage.getItem("cms-token") }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: "100%",
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </div>
  );
}
