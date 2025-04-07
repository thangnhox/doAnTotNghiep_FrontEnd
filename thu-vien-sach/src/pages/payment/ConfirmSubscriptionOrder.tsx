import React, { useCallback, useEffect } from 'react'
import { Button, Card, Divider, Input, message, Spin, Typography } from "antd";
import { useState } from "react";
import { AxiosResponse } from "axios";
import { handleAPI } from "../../remotes/apiHandle";
import { Discount } from "../../models/Discount";
import { ResponseDTO } from "../../dtos/ResponseDTO";
import { useNavigate, useParams } from 'react-router-dom';
import Membership, { MembershipRankDescription } from '../../models/Membership';

const ConfirmSubscriptionOrder = () => {
    const { membershipId } = useParams()
    const { Title, Text } = Typography;
    const [isLoading, setLoading] = useState<boolean>(false);
    const [discount, setDiscount] = useState<Discount | null>(null);
    const [membership, setMembership] = useState<Membership | null>(null);
    const navigate = useNavigate();

    const getMembershipInfo = useCallback(
        async () => {
            try {
                setLoading(true);
                const res: AxiosResponse<ResponseDTO<Membership>> = await handleAPI(
                    `membership/fetch/${membershipId}`
                );
                setMembership(res.data.data);
            } catch (error: any) {
                console.log(error);
    
            } finally {
                setLoading(false);
            }
        }, [membershipId]
    )

    useEffect(() => {
        getMembershipInfo();
    }, [getMembershipInfo])

    const renderMembershipInfo = (membership: Membership | null) => {
        if (!membership) return null;
        return (
            <div className="d-flex flex-column gap-3">
                <div className="d-flex flex-row justify-content-between align-items-center w-100">
                    <Text>Tên gói:</Text>
                    <Text>{membership.name}</Text>
                </div>
                <div className="d-flex flex-row justify-content-between align-items-center w-100">
                    <Text>Chức năng:</Text>
                    <Text>{MembershipRankDescription(membership.rank)}</Text>
                </div>
                <div className="d-flex flex-row justify-content-between align-items-center w-100">
                    <Text>Giá:</Text>
                    <Text>{membership.price} VND</Text>
                </div>

            </div>
        )
    }

    const applyDiscount = async () => {
        try {
            setLoading(true);
            const values = (document.getElementById("discountInput") as HTMLInputElement).value.trim();
            const res: AxiosResponse<ResponseDTO<Discount[]>> = await handleAPI(
                `discount/fetch/${values}`
            );
            console.log(res.data.data)
            if (res.data.data[0].status === 0) {
                message.error("Mã giảm giá không tồn tại hoặc đã hết hạn");
                return;
            }
            else {
                setDiscount(res.data.data[0]);
            }
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const performSubciption = async () => {
        try {

            setLoading(true);
            const orderRes: AxiosResponse = await handleAPI(
                `membership/subscribe`,
                {
                    membershipId: membership?.id,
                    discountName: discount?.name ?? null,
                },
                "post"
            );
            if (orderRes.status === 200) {
                console.log(orderRes)
                if (orderRes.data.data && orderRes.data.data.PayUrl) {
                    window.location.href = orderRes.data.data.PayUrl;
                } else {
                    message.success(orderRes.data.message);
                    setTimeout(() => navigate("/"), 1000);
                }
            }
        } catch (error: any) {
            if (error.response.status === 403) {
                message.error(error.response.data.message);
                setTimeout(() => navigate("/membership/subscribe/"), 5000);
            }
            console.log(error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="d-flex flex-column w-100 mt-3 align-items-center ">
            {isLoading ? (
                <Spin />
            ) : (
                <>
                    <Title level={2}>Xác nhận thông tin thanh toán</Title>
                    <Card className='p-3' title={membership?.name ?? "N/a"} actions={[<div className="d-flex flex-column gap-4 m-3">
                        <div className="d-flex flex-row gap-3 justify-content-between align-items-center ">
                            <Input
                                id="discountInput"
                                placeholder="Nhập mã giảm giá" />
                            <Button type="primary" onClick={applyDiscount} >Áp dụng mã</Button>
                        </div>
                        <Divider />
                        {
                            discount && discount.status !== 0 ? (
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex flex-row justify-content-between align-items-center w-100">
                                        <Text>Mã giảm giá:</Text>
                                        <Text>{discount.name ?? "N/A"}</Text>
                                    </div>
                                    <div className="d-flex flex-row justify-content-between align-items-center w-100">
                                        <Text>Tỉ lệ giảm:</Text>
                                        <Text>{discount.ratio ?? "N/A"}%</Text>
                                    </div>
                                </div>
                            ) : null}
                        <>
                            <div className="d-flex flex-row justify-content-between align-items-center w-100">
                                <Text>Tổng cộng:</Text>
                                {
                                    !discount ? <Text>{membership?.price ?? 0} VND</Text> :
                                        <div className="d-flex flex-column gap-1" >
                                            <Text >{membership!.price - (membership!.price * discount.ratio)} VND</Text>
                                            <Text type="danger" delete  >{membership?.price ?? 0} VND</Text>
                                        </div>
                                }
                            </div>
                            <Divider />
                        </>
                        <Button type="primary" onClick={performSubciption}>
                            Thanh toán
                        </Button>
                    </div>]}
                    >
                        {
                            renderMembershipInfo(membership)
                        }
                    </Card>
                </>
            )}
        </div>
    )
}

export default ConfirmSubscriptionOrder