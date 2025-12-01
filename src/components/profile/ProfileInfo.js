import { useState, useEffect } from "react";

export default function ProfileInfo({ profile, user, saving, onSave }) {
  const [form, setForm] = useState({ name: "", phone: "" });

  useEffect(() => {
    setForm({ name: profile.name, phone: profile.phone });
  }, [profile]);

  return (
    <>
      <h5 className="fw-bold border-bottom pb-3 mb-4">Hồ sơ của tôi</h5>
      <div className="row mb-3 align-items-center">
        <label className="col-sm-3 col-form-label text-muted">Email</label>
        <div className="col-sm-9">
          <input className="form-control-plaintext fw-bold text-dark" value={user?.email} readOnly />
        </div>
      </div>
      <div className="row mb-3 align-items-center">
        <label className="col-sm-3 col-form-label text-muted">Họ tên</label>
        <div className="col-sm-9">
          <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
      </div>
      <div className="row mb-4 align-items-center">
        <label className="col-sm-3 col-form-label text-muted">Số điện thoại</label>
        <div className="col-sm-9">
          <input className="form-control" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-9 offset-sm-3">
          <button className="btn btn-primary px-4 fw-medium" disabled={saving} onClick={() => onSave(form)}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </>
  );
}