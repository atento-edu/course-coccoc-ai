"use client";

import type { ButtonHTMLAttributes } from "react";

export function ConfirmButton({
  message = "Bạn chắc chắn muốn xoá? Thao tác này không hoàn tác được.",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { message?: string }) {
  return (
    <button
      {...props}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
