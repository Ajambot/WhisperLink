import React from "react";
import textStyles from './Popup.module.css'
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
        <button className ={textStyles.popContainer} onClick={closeFn}>
          Close
        </button>
      </div>
      {children}
    </div>
  );
};

export default Popup;