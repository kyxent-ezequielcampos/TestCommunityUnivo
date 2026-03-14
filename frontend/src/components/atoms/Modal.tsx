import React from 'react';

interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClass = {
  sm: 'sm:max-w-sm w-full max-w-xs',
  md: 'sm:max-w-md w-full max-w-xs',
  lg: 'sm:max-w-5xl w-full max-w-full',
};

export const Modal: React.FC<ModalComponentProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  size = 'md',
}) => {
  if (!open) return null;
  return (
    <dialog open className={`modal modal-open`}>
      <div className={`modal-box ${sizeClass[size]} w-full max-w-full break-words  p-4 sm:p-6`}>
        {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}
        <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>{children}</div>
        {actions && <div className="modal-action">{actions}</div>}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}; 