import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  width,
}: ModalProps) {
  const [show, setShow] = useState(isOpen);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setAnimateOut(false);
    } else if (show) {
      setAnimateOut(true);
      setShow(false);
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white relative rounded-lg p-6 max-h-[90%] overflow-y-auto shadow-lg transform transition-transform duration-200 ${
          animateOut ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ minWidth: width ?? "300px" }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-black cursor-pointer"
        >
          <IoClose size={25} />
        </button>
        {children}
      </div>
    </div>
  );
}
