import React from "react";

export default function AccountSidebar({ menu, setMenu, userName = "User" }) {
  const menuItems = [
    { key: "info", label: "Thông tin tài khoản", icon: "bi bi-person" },
    { key: "address", label: "Sổ địa chỉ", icon: "bi bi-geo-alt" },
    { key: "orders", label: "Quản lý đơn hàng", icon: "bi bi-bag-check" },
    { key: "logout", label: "Đăng xuất", icon: "bi bi-box-arrow-right" }
  ];

  const firstChar = userName?.trim()?.[0]?.toUpperCase() || "?";

  return (
    <div className="account-box">
      <div className="account-user">
        <div className="avatar">{firstChar}</div>
        <strong>{userName}</strong>
      </div>

      <div className="account-menu">
        {menuItems.map((m) => (
          <button
            key={m.key}
            type="button"
            className={
              "account-item border-0 bg-transparent w-100 text-start " +
              (menu === m.key ? "active" : "")
            }
            onClick={() => setMenu(m.key)}
          >
            <i className={m.icon} />
            <span>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
