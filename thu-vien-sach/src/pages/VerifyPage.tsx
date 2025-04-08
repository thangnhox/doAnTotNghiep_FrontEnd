import { message } from 'antd';
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ResponseDTO } from '../dtos/ResponseDTO';
import { AxiosResponse } from 'axios';
import Token from '../models/Token';
import { handleAPI } from '../remotes/apiHandle';
import { useDispatch } from 'react-redux';
import { AddAuth } from '../redux/authSlice';
import { useCallback } from 'react';

const VerifyPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const verifyAccount = useCallback(async () => {
    try {
      const res: AxiosResponse<ResponseDTO<Token>> = await handleAPI(`user/verify/${token}`);
      if (res.status === 201) {
        dispatch(AddAuth({ token: res.data.data, user: null, membership: null }));
        const userInfo = await handleAPI('user/info', null, 'get');
        if (userInfo.status === 200) {
          dispatch(AddAuth({ token: res.data.data, user: userInfo.data.data, membership: null }));
          navigate('/', { replace: true });
          message.success('Xác minh thành công');
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Đã xảy ra lỗi');
      console.error(error);
    }
  }, [token, dispatch, navigate]); // Dependencies: token, dispatch, navigate

  useEffect(() => {
    verifyAccount();
  }, [verifyAccount]); // Include verifyAccount as a dependency

  return <div></div>;
};

export default VerifyPage;