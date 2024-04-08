import React from "react";
import "../Global.module.css";
import textStyles from './Popup.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
interface Props {
  title: string;
  children: React.ReactNode;
  closeFn: () => void;
}

const Popup = ({ title, children, closeFn }: Props) => {
  return (
    <div className="popup link">
      <div className ={textStyles.bodyContainer}>
        <h1>{title}</h1>
        {children}
        <button className ={textStyles.buttonContainer} onClick={closeFn}>
        <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default Popup;