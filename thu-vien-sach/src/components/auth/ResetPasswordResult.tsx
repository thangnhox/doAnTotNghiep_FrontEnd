import { Button, Card, Form, Input, Modal, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { handleAPI } from '../../remotes/apiHandle';
import { useForm } from 'antd/es/form/Form';

const ResetPasswordResult = () => {
    const { token } = useParams();
    const [isLoading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [form] = useForm()
    const navigate = useNavigate()

    useEffect(() => { }, [])

    const performResetPassword = async () => {
        const pass = form.getFieldValue("password")
        const passConfirm = form.getFieldValue("passwordConfirm")
        if (pass.trim() === "" || passConfirm.trim() === "") {
            setMessage("Mật khẩu không hợp lệ")
            return;
        }
        if (pass !== passConfirm) {
            setMessage("Mật khẩu và xác nhận không chính xác")
            return;
        }
        try {
            setLoading(true)
            const res = await handleAPI(`user/resetPassword/${token}`, { newPassword: pass }, "post")
            if (res.status === 200) {
                setOpenModal(true)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        isLoading ? <Spin /> : <>
            <Card title="Đổi mật khẩu">
                <Form form={form} onFinish={performResetPassword}>
                    <Form.Item label="Mật khẩu mới" name={"password"}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item label="Xác nhận mật khẩu mới" name={"passwordConfirm"}>
                        <Input.Password />
                    </Form.Item>
                </Form>
                <Typography.Text type='danger' >{message}</Typography.Text>
                <Button type='primary' onClick={() => form.submit()} >Gửi</Button>
            </Card>
            <Modal open={openModal} closable={false} onOk={() => navigate('/login')} onCancel={() => navigate('/login')}>
                Đổi mật khẩu thành công. Vui lòng đăng nhập lại
            </Modal>
        </>
    )
}

export default ResetPasswordResult