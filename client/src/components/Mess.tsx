import React from 'react';

interface MessProps {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function Mess({ title, message, onCancel, onConfirm }: MessProps) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel}>Hủy bỏ</button>
          <button onClick={onConfirm}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
}
