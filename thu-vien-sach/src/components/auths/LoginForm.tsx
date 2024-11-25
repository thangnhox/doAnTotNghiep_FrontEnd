import { Button, Card, Checkbox, Form, Input, message, Spin } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useState } from 'react'
import { AppConstants } from '../../appConstants';
import { AxiosResponse } from 'axios';
import { ResponseDTO } from '../../dtos/ResponseDTO';
import Token from '../../models/Token';
import { handleAPI } from '../../remotes/apiHandle';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {

  const [loginForm] = useForm();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isRememberMe, setRememberMe] = useState<boolean>(false)
  const dispatch = useDispatch()
  const navigator = useNavigate()

  const login = async () => {
    const email: string  = loginForm.getFieldValue('email');
    const password: string = loginForm.getFieldValue('password');
    try {
      setLoading(true)
      const req = {
        email,
        password
      }
      const res: AxiosResponse<ResponseDTO<Token>> = await handleAPI(`user/login`, req , 'post');
      if(res.status === 200){
        dispatch(addAuth({token: res.data.data}))
        if(isRememberMe){
          localStorage.setItem(AppConstants.token, JSON.stringify(res.data.data))
        }
        navigator('/',{replace: true});
        message.success('Đăng nhập thành công')
      }
    } catch (error:any) {
      message.error(error.response.message)
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  return (
    <Card
    title='Đăng nhập'>
      <Form 
      form={loginForm} 
      onFinish={login}>
        <Form.Item 
        name={'email'}
        label="Email" 
        rules={[
          {
            required: true,
            min: 3,
            message: 'Email không được trống'
          },
          {
            pattern: AppConstants.regex.email,
            message: 'Email không đúng định dạng'
          }
        ]} >
          <Input />
        </Form.Item>
        <Form.Item 
        name={'password'}
        label="Mật khẩu" 
        rules={[
          {
            required: true,
            min: 3,
            message: 'Mật khẩu không được trống'
          }
        ]} >
          <Input.Password/>
        </Form.Item>
        <Form.Item initialValue={isRememberMe} valuePropName='checked' >
          <Checkbox>Ghi nhớ đăng nhập</Checkbox>
        </Form.Item>
        <Button type='primary' onClick={()=> loginForm.submit()} loading={isLoading} >Đăng nhập </Button>
      </Form>
    </Card>
  )
}

export default LoginForm