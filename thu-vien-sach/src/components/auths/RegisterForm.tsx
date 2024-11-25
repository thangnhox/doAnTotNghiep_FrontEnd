import { Button, Card, DatePicker, DatePickerProps, Form, Input, message, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form'
import { AxiosResponse } from 'axios';
import React, { useState } from 'react'
import { ResponseDTO } from '../../dtos/ResponseDTO';
import Token from '../../models/Token';
import { handleAPI } from '../../remotes/apiHandle';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [birthYear, setBirthYear] = useState<number>();
  const [isOpenModal, setOpenModal] = useState<boolean>(false)
  const navigate = useNavigate()
  const [registerForm] = useForm();

  const register = async () => {
    const password: string = registerForm.getFieldValue('password');
    const confirm: string = registerForm.getFieldValue('confirmPassword');
    if(password !== confirm){
      registerForm.setFields([
        {
          name:'password',
          errors:['Mật khẩu và xác nhận phải giống nhau']
        },
        {
          name:'confirmPassword',
          errors:['Mật khẩu và xác nhận phải giống nhau']
        }
      ]);
    }
    const name: string = registerForm.getFieldValue('name');
    const email: string = registerForm.getFieldValue('email');

    try {
      setLoading(true)
      const req = {
        email,
        password,
        birthYear,
        name
      }
      const res: AxiosResponse = await handleAPI(`user/createUser`,req, 'post');
      if(res.status === 200) {
        setOpenModal(true) 
      }
    } catch (error:any) {
      console.log(error)
      message.error(error.message)
    }finally{
      setLoading(false)
    }

  }

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setBirthYear(date.year())
  };

  return (
    <>
    <Card
      loading={isLoading}
      title='Đăng ký thành viên'>
      <Form
        form={registerForm}
        onFinish={register}>
        <Form.Item
          name={'name'}
          label={'Tên'}
          rules={[
            {
              required: true,
              min: 2,
              message: 'Tên không hợp lệ'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'email'}
          label={'Email'}
          rules={[
            {
              required: true,
              min: 3,
              message: "Email không được trống"
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'password'}
          label={'password'}
          rules={[
            {
              required: true,
              min: 2,
              message: 'Mật khẩu không hợp lệ'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name={'confirmPassword'}
          label={'Xác nhận mật khẩu'}
          rules={[
            {
              required: true,
              min: 2,
              message: 'Mật khẩu không hợp lệ'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name={'birtYear'}
          label={'Năm sinh'}
          rules={[
            {
              required: true,
              message: 'Năm hợp lệ'
            }
          ]}
        >
          <DatePicker onChange={onChange} picker="year" />
        </Form.Item>
        <Button type='primary' onClick={() => registerForm.submit()} loading={isLoading}>Đăng ký</Button>
      </Form>
    </Card>
    <Modal title ="Thông báo" open={isOpenModal} centered closable={false} footer={
      <Button type='primary' onClick={()=> navigate('/',{replace:true})} >Ok</Button>
    } >
      <p><span>Đăng ký thành công, hãy kiểm tra email của bạn để xác thực tài khoản!!</span></p>
    </Modal>
    </>
  )
}

export default RegisterForm