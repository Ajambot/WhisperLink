import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  closeFn: () => void;
}

const Popup = ({ title, children, closeFn }: Props) => {
  return (
    <div className="popup link">
      <div className="header">
        <h1>{title}</h1>
        <button className="close-btn" onClick={closeFn}>
          Close Popup
        </button>
      </div>
      {children}
    </div>
  );
};

export default Popup;
