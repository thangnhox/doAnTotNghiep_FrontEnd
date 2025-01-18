import { Button, Card, Form, Input, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useState } from 'react'
import { AppConstants } from '../../appConstants'
import { handleAPI } from '../../remotes/apiHandle'

const ResetPasswordForm = () => {
    const [form] = useForm()
    const [isModalOpen, setModalOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")

    const sendPasswordResetRequest = async () => {
        try {
            const email = form.getFieldValue('email')
            const res = await handleAPI(`user/resetPassword`, { email }, "post")
            if (res.status === 200) {
                setMessage("Vui lòng kiểm tra email của bạn!")
                setModalOpen(true)
            }
        } catch (error) {
            console.log(error)
            setMessage("Đã xảy ra lỗi. Vui lòng thử lại sau")
            setModalOpen(true)
        }
    }

    return (
        <>
            <Card
                title={<h3 style={{ textAlign: 'center', color: '#1890ff', marginBottom: '16px' }}>Đặt lại mật khẩu</h3>}
                style={{
                    width: '400px',
                    margin: '0 auto',
                    padding: '16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={sendPasswordResetRequest}
                    style={{ padding: '0 16px' }}
                >
                    <Form.Item
                        label={<b>Email</b>}
                        name="email"
                        rules={[
                            {
                                message: 'Email không đúng định dạng',
                                pattern: AppConstants.regex.email,
                            },
                            {
                                message: 'Email không được trống',
                                required: true,
                            },
                            {
                                whitespace: false,
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập email của bạn"
                            style={{
                                height: '38px',
                                borderRadius: '4px',
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            onClick={() => form.submit()}
                            type="primary"
                            style={{
                                width: '100%',
                                height: '38px',
                                borderRadius: '4px',
                                backgroundColor: '#1890ff',
                                borderColor: '#1890ff',
                            }}
                        >
                            Gửi
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Modal open={isModalOpen} closable={false} onOk={() => setModalOpen(false)} onCancel={() => setModalOpen(false)}>
                {message}
            </Modal >
        </>
    )
}

export default ResetPasswordForm