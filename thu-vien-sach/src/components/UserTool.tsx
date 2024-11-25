import { Avatar, Menu, MenuProps, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import User from '../models/User'


const UserTool = () => {
    const { Text } = Typography

    useEffect(() => {
        // console.log('userEmail', userEmail)
    },[])

  return <div className="d-flex flex-row gap-3 justify-content-end align-items-center w-100 ">
    {/* <Text>{user?.name}</Text>
    <Text>{user?.email}</Text> */}
    <Avatar/>
  </div>
}

export default UserTool