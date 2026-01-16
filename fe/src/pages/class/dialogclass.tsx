import React, { useEffect, useState } from 'react'
import { Modal as AntModal, Input, Row, Col, Select, InputNumber } from "antd"
import { ClassServices, MajorServices } from '../../services/student.services';
import { toast } from 'react-toastify';

type Props = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataEdit: any;
}

const DialogClass = ({ open, setOpen, dataEdit }: Props) => {
  console.log("DialogClass")
  const init = {
    ClassName: "",
    AcademicYear: 0,
    MajorId: ""
  }
  const [payload, setPayload] = useState<any>(init)
  const [listMajor, setListMajor] = useState<any>([])

  const validate = (pay = payload) => {
    if (!pay.ClassName.trim()) {
      toast.error("Vui lòng nhập tên lớp học");
      return false;
    }
    if (!pay.AcademicYear || pay.AcademicYear <= 0) {
      toast.error("Vui lòng nhập năm học hợp lệ");
      return false;
    }
    if (!pay.MajorId) {
      toast.error("Vui lòng chọn ngành học");
      return false;
    }
    return true;
  };
  const handleConfirm = async (pay) => {
    if (!validate()) return;

    try {
      if (dataEdit) {
        await ClassServices.Update(dataEdit._id, pay);
        toast.success("Cập nhật thành công");
      } else {
        await ClassServices.Add(pay);
        toast.success("Thêm mới thành công");
      }
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleCancel = () => {
    setOpen(false)
  }
  const getNganhHoc = async () => {
    let res = await MajorServices.GetList();
    setListMajor(res.data)
  }
  useEffect(() => {
    getNganhHoc();
    if (dataEdit) {
      setPayload({
        ...dataEdit,
        MajorId: dataEdit.MajorId._id
      });
    } else {
      setPayload(init);
    }
  }, [dataEdit]);
  console.log("payload?.MajorId", payload?.MajorId)
  return (
    // <div>DialogClass</div>
    <>
      <AntModal
        title={`${Object.keys(dataEdit ?? {}).length > 0 ? 'Cập nhật môn học' : 'Thêm mới môn học'}`}
        open={open}
        onOk={() => handleConfirm(payload)}
        onCancel={handleCancel}
        width={900}
        getContainer={false}
      >
        <div style={{ width: '100%', marginTop: '1rem' }}>
          <Row gutter={[18, 18]}>
            <Col span={24}>
              <div className="form-item">
                <label className="form-label">Tên lớp học</label>
                <Input
                  placeholder="Nhập tên lớp"
                  value={payload?.ClassName}
                  onChange={(e) =>
                    setPayload((prev) => ({
                      ...(prev ?? init),
                      ClassName: e.target?.value,
                    }))
                  }
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="form-item flex flex-col">
                <label className="form-label">Năm học</label>
                <InputNumber
                  placeholder="Nhập năm học"
                  className="w-full"
                  value={payload?.AcademicYear}
                  onChange={(e) =>
                    setPayload((prev) => ({
                      ...(prev ?? init),
                      AcademicYear: e,
                    }))
                  }
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="form-item flex flex-col">
                <label className="form-label">Ngành</label>
                <Select
                  placeholder="Chọn ngành"
                  className="w-full"
                  value={payload?.MajorId}
                  onChange={(e) => setPayload((prev) => ({ ...prev, MajorId: e }))}
                  options={listMajor.map((e: any) => ({
                    value: e._id,
                    label: e.name
                  }))}
                />
              </div>
            </Col>
          </Row>
        </div>
      </AntModal>
    </>
  )
}

export default DialogClass