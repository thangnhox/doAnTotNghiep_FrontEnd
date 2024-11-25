import { Button, Input, Menu, MenuProps } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Search from 'antd/es/transfer/search'
import React, { useEffect } from 'react'
import { addAuth, authState, AuthState } from '../redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppConstants } from '../appConstants'
import { validateToken } from '../utils/jwtUtil'
import UserTool from './UserTool'
import { Link, useNavigate } from 'react-router-dom'
import { ItemType, MenuItemType } from 'antd/es/menu/interface'

const HeaderComponent = () => {
  const auth: AuthState = useSelector(authState)
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const menuItems: ItemType<MenuItemType>[]= [{
    key: 'home',
    label: (<Link className='nav-item' to={'/'} >Trang chủ</Link>)
  },
  {
    key: 'about',
    label:(<Link className='nav-item' to={'/'} >Về chúng tôi</Link>)
  },
  {
    key: 'vision',
    label:(<Link className='nav-item' to={'/'}>Tầm nhìn</Link>)
  },
  {
    key: 'contact-us',
    label:(<Link className='nav-item' to={'/'}>Liên hệ</Link>)
  }
]

useEffect(()=> {
  checkLogin()
},[])

const checkLogin = () => {
  const res = localStorage.getItem(AppConstants.token);
  if(!res) {
    return;
  }
  if(!validateToken(res)){
    return;
  }
  dispatch(addAuth(JSON.parse(res)))
}

  return <Header className='d-flex flex-row justify-content-between p-0 m-0 gap-3 bg-white rounded' >
   <Menu items= {menuItems} mode='horizontal' defaultSelectedKeys={['home']} style={{flex:0.5}} />
   <div className="d-flex flex-row gap-3 pe-5 m-0 align-items-center w-25">
   <Input.Search placeholder='Nhập tên sách cần tìm'/>

   {
    !auth.token ? <>
    <Button type='primary' className='bg-warning' onClick={()=> navigate('/register')} >Đăng ký</Button>
    <Button type='primary' onClick={()=> navigate('/login')}>Đăng nhập</Button>
    </> : <UserTool/>
   }
   </div>
  </Header>
}

export default HeaderComponent