import { PageHeader, Steps, Button, Form, Input, Select } from "antd";
import React, { useState, useRef } from "react";
import ArticleEditor from "../../../components/article-manage/ArticleEditor";
import style from "./AddArticle.module.css";

const { Step } = Steps;
const { Option } = Select;

export default function AddArticle() {
  const [curStep, setCurStep] = useState(0);
  const [lastStep, setlastStep] = useState(0);

  const firstFormRef = useRef(null)
  const onChange = (item) => {
    if (item <= lastStep) setCurStep(item);
  };

  const nextStep = (item) => {
    if(curStep===0) {
      firstFormRef.current.validateFields().then((res) => {
        setlastStep(curStep + 1 > lastStep ? curStep + 1 : lastStep);
        setCurStep(curStep + 1);  
        return;
      }).catch((err) => {
        console.log(err)
      });
    }else{
      setlastStep(curStep + 1 > lastStep ? curStep + 1 : lastStep);
      setCurStep(curStep + 1);
    }
    
  };

  const prevStep = (event) => {
    setCurStep(curStep - 1);
  };

 
  return (
    <div>
      <PageHeader
        style={{
          border: "1px solid rgb(235, 237, 240)",
        }}
        onBack={() => null}
        title="开始你的文章撰写吧！"
        subTitle="This is a subtitle"
      />

      <Steps current={curStep} onChange={onChange}>
        <Step title="Finished" description="This is a description." />
        <Step
          title="In Progress"
          subTitle="Left 00:00:08"
          description="This is a description."
        />
        <Step title="Waiting" description="This is a description." />
      </Steps>

     <div className={style.form}>
        <Form
          name="basic"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
          ref={firstFormRef}
        >
          <Form.Item
            label="文章标题"
            name="title"
            rules={[
              {
                required: true,
                message: "标题不能为空",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="文章类型"
            name="category"
            rules={[
              {
                // required: true,
                // message: "请选择文章类型",
              },
            ]}
          >
            <Select>
              <Option></Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
      <ArticleEditor />

      <div className={style.endButton}>
        {curStep === 2 ? (
          <Button type="primary" danger onClick={nextStep}>
            提交审核
          </Button>
        ) : (
          <Button type="primary" onClick={nextStep} disabled={curStep === 2}>
            下一步
          </Button>
        )}
        {curStep > 0 && (
          <Button style={{ marginLeft: "10px" }} onClick={prevStep}>
            上一步
          </Button>
        )}
      </div>
    </div>
  );
}
