import { Avatar, Button, Dropdown, DropDownProps, Menu, MenuProps, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import User from '../models/User'
import { useDispatch, useSelector } from 'react-redux'
import { authState, RemoveAuth } from '../redux/authSlice'
import { NotificationOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'

const UserTool = () => {
  const { Text } = Typography
  const user = useSelector(authState)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const items: MenuProps['items'] = [
    {
      key: 'user-infomation',
      label: <Link className='nav-item' to={'user/user-detail'}>Thông tin</Link>
    },
    {
      key: 'logout',
      danger: true,
      label: 'Đăng xuất',
      onClick: () => handleLogout()
    },
  ];

  const handleLogout = () => {
    dispatch(RemoveAuth())
    navigate('/')
  }

  return <div className="d-flex flex-row gap-3 justify-content-end align-items-center w-75">
    <Dropdown menu={{ items }} >
      { user.user?.avatar && user.user.avatar.length >0 ? <Avatar src={user?.user?.avatar} /> : <Avatar icon={<UserOutlined />}/>}
    </Dropdown>

    <div className="d-flex flex-column justify-content-center align-items-start" >
      <Text>{user?.user?.name}</Text>
      <Text>{user?.user?.email}</Text>
    </div>
    <Button shape='circle' icon={<NotificationOutlined />} />
  </div>
}

export default UserTool