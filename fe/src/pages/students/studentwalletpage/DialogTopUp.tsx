import React from 'react'
import { Modal as AntModal, Card } from "antd"
type Props = {
    isModalOpen: boolean
}

export default function DialogTopUp({ isModalOpen }: Props) {
    const handleOk = () => {

    }
    const handleHuy = () => {

    }
    return <>
        <AntModal
            title="Nạp tiền vào ví"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleHuy}
            width={800}
            getContainer={false}
            bodyStyle={{ padding: 24 }}
        ></AntModal>
    </>
}
