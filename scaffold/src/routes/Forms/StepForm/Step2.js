import React from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

export default ({ formItemLayout, form, data, dispatch, submitting }) => {
  const { getFieldDecorator, validateFields } = form;
  const onPrev = () => {
    dispatch(routerRedux.push('/form/step-form'));
  };
  const onValidateForm = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitStepForm',
          payload: {
            ...data,
            ...values,
          },
        });
      }
    });
  };
  return (
    <Form layout="horizontal" className={styles.stepForm}>
      <Alert
        showIcon
        message="确认转账后，资金将直接打入对方账户，无法退回。"
        style={{ marginBottom: 24 }}
      />
      <Form.Item
        {...formItemLayout}
        label="付款账户"
      >
        {data.payAccount}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="收款账户"
      >
        {data.receiverAccount}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="收款人姓名"
      >
        {data.receiverName}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="转账金额"
      >
        {data.amount}
      </Form.Item>
      <hr className={styles.divider} />
      <Form.Item
        {...formItemLayout}
        label="支付密码"
        required={false}
      >
        {getFieldDecorator('password', {
          rules: [{
            required: true, message: '需要支付密码才能进行支付',
          }],
        })(
          <Input type="password" autoComplete />
        )}

      </Form.Item>
      <Form.Item
        wrapperCol={{ offset: 5 }}
        label=""
      >
        <Button type="primary" onClick={onValidateForm} loading={submitting}>
          提交
        </Button>
        <Button onClick={onPrev} style={{ marginLeft: 8 }}>
          上一步
        </Button>
      </Form.Item>
    </Form>
  );
};
