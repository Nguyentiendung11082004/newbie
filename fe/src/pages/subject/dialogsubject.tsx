import { Input, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { Subject } from '../../types';
import { MajorServices, SubjectServices } from '../../services/student.services';
import { toast } from 'react-toastify';
type Props = {
  isModalOpen: boolean,
  setOpen: any;
  data: [],
  dataEdit: any,
  setDataEdit: any
}
const initState = {
  _id: '',
  name: '',
  code: '',
  tuitionFee: 0,
  description: '',
  credits: 0,
  MajorId: null,
  prerequisite: [],
}
const DialogSubject = ({ isModalOpen, setOpen, data, dataEdit, setDataEdit }: Props) => {
  const [payload, setPayload] = useState<Subject>(initState);
  const [listMajor, setListMajor] = useState<any[]>([])
  const handleSerForm = (prop: string, value: string | number) => {
    setPayload((prev: any) => ({
      ...prev,
      [prop]: value
    }))
  }
  const handleClose = () => {
    setOpen(false);
    setDataEdit(null)
    setPayload(initState)
  }
  const validate = (pay) => {
    if (!pay.name.trim()) {
      toast.error('Chưa nhập tên môn học');
      return false
    }
    if (!pay.code.trim()) {
      toast.error('Chưa nhập mã môn học');
      return false
    }
    if (!pay.tuitionFee.trim()) {
      toast.error('Chưa nhập học phí môn học');
      return false
    }
    if (!pay.credits.trim()) {
      toast.error('Chưa nhập tín chỉ môn học');
      return false
    }
    return true;
  }
  const handleOk = async () => {
    try {
      if (!validate(payload)) return false;
      let res: any = null;
      if (dataEdit) {
        res = await SubjectServices.Update(payload._id, payload);
      } else {
        res = await SubjectServices.Add(payload);
      }
      if (res) {
        toast.success(res.message);
        handleClose()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const getbyId = async (id) => {
    let res = await SubjectServices.GetById(id);
    setPayload(res.data)
  }
  const getNganhHoc = async () => {
    let res = await MajorServices.GetList();
    setListMajor(res.data)
  }
  useEffect(() => {
    if (dataEdit) {
      getbyId(dataEdit._id)
    }
    getNganhHoc()
  }, [dataEdit])

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Học phí </label>
          <Input placeholder="Nhập mã môn" className="h-10 rounded-md border border-gray-300 px-3"
            value={payload?.tuitionFee}
            onChange={(e) => handleSerForm('tuitionFee', e.target.value)}
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
            min={0}
            onChange={(e) => handleSerForm('credits', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngành học (nếu có)</label>
          <Select
            placeholder="Chọn môn học tiên quyết"
            className="w-full"
            value={payload.MajorId}
            onChange={(e) => setPayload((prev) => ({ ...prev, MajorId: e }))}
            options={listMajor.map((e: any) => ({
              value: e._id,
              label: e.name,
            }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Môn tiên quyết (nếu có)</label>
          <Select
            placeholder="Chọn môn học tiên quyết"
            className="w-full"
            mode="multiple"
            value={payload.prerequisite}
            onChange={(e) => setPayload((prev) => ({ ...prev, prerequisite: e }))}
            options={data.map((e: any) => ({
              value: e._id,
              label: e.name,
              disabled: e._id === payload._id
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