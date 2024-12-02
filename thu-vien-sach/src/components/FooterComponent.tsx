import { Footer } from 'antd/es/layout/layout'
import React from 'react'

const FooterComponent = () => {
  return (
    <Footer className='bg-white mt-5' >
      <div className="d-flex flex-column gap-3 pt-5 ">
        <span>Created by <br/>  <strong>Lương Trung</strong> <br/> and <br/> <strong>Tôn Đức Thắng</strong></span>
      </div>
    </Footer>
  )
}

export default FooterComponent