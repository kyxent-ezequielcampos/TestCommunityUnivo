import React from "react";
import { createPortal } from "react-dom";

interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClass = {
  sm: "max-w-sm",
  md: "max-w-xl",
  lg: "max-w-5xl",
};

export const Modal: React.FC<ModalComponentProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  size = "md",
}) => {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/40"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full ${sizeClass[size]} rounded-xl bg-base-100 shadow-2xl ring-1 ring-black/10`}
      >
        <div className="flex items-center justify-between border-b border-base-200 px-5 py-4">
          <div className="text-lg font-semibold text-base-content">{title ?? ""}</div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-square btn-ghost"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          {children}
        </div>

        {actions ? (
          <div className="border-t border-base-200 px-5 py-4 flex items-center justify-end gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
};
