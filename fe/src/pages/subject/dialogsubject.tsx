import { Input, Modal, Select } from 'antd'
import React, { useState } from 'react'
import { Subject } from '../../types';
import { SubjectServices } from '../../services/student.services';
import { toast } from 'react-toastify';
type Props = {
  isModalOpen: boolean,
  setOpen: any;
  data: []
}
const DialogSubject = ({ isModalOpen, setOpen, data }: Props) => {
  const [payload, setPayload] = useState<Subject>({
    name: '',
    code: '',
    description: '',
    credits: 0,
    prerequisite: [],
  });
  const handleSerForm = (prop: string, value: string | number) => {
    setPayload((prev: any) => ({
      ...prev,
      [prop]: value
    }))
  }
  const handleClose = () => {
    setOpen(false);
    setPayload({
      name: '',
      code: '',
      description: '',
      credits: 0,
      prerequisite: [],
    })
  }
  const handleOk = async () => {
    let res = await SubjectServices.Add(payload);
    if (res) {
      toast.success(res.data.message);
      handleClose()
    }
  }

  return (
    <Modal title="Thêm mới môn học" open={isModalOpen} onOk={handleOk} onCancel={() => handleClose()}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên môn học</label>
          <Input placeholder="Nhập tên môn" className="h-10 rounded-md border border-gray-300 px-3"
            value={payload?.name}
            onChange={(e) => handleSerForm('name', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mã môn học</label>
          <Input placeholder="Nhập mã môn" className="h-10 rounded-md border border-gray-300 px-3"
            value={payload?.code}
            onChange={(e) => handleSerForm('code', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <Input placeholder="Mô tả ngắn gọn" className="h-10 rounded-md border border-gray-300 px-3"
            value={payload?.description}
            onChange={(e) => handleSerForm('description', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số tín chỉ</label>
          <Input type="number" placeholder="Nhập tín chỉ" className="h-10 rounded-md border border-gray-300 px-3"
            value={payload?.credits}
            onChange={(e) => handleSerForm('credits', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Môn tiên quyết (nếu có)</label>
          <Select
            placeholder="Chọn môn học tiên quyết"
            className="w-full"
            mode="multiple"
            onChange={(e) => setPayload((prev) => ({ ...prev, prerequisite: e }))}
            options={data.map((e: any) => ({
              value: e._id,
              label: e.name
            }))}
          />
        </div>
      </div>
    </Modal>
  )
}

export default DialogSubject

// {
//   "name": "Nhập ngôn lập trình",
//   "code":"A01",
//   "description": "Làm quan với lập trình",
//   "credit": 8,
//   "prerequisite": []
// }