import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ResponseDTO } from '../dtos/ResponseDTO';
import { AxiosResponse } from 'axios';
import Token from '../models/Token';
import { handleAPI } from '../remotes/apiHandle';
import { useDispatch } from 'react-redux';
import { AddAuth } from '../redux/authSlice';

const VerifyPage = () => {
  const { token } = useParams();
  const [isLoading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    verifyAccount();
  }, [])


  const verifyAccount = async () => {
    try {
      setLoading(true)
      const res: AxiosResponse<ResponseDTO<Token>> = await handleAPI(`user/verify/${token}`);
      if (res.status === 201) {
        dispatch(AddAuth({ token: res.data.data }))
        navigate('/', { replace: true })
        message.success('Xác minh thành công')
      }
    } catch (error: any) {
      message.error(error)
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>VerifyPage</div>
  )
}

export default VerifyPage