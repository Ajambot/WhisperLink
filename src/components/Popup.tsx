import React, { useEffect, useRef } from "react";
import textStyles from './Popup.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
interface Props {
  title?: string;
  children: React.ReactNode;
  closeFn: () => void;
}

const Popup = ({ title, children, closeFn }: Props) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [children]); // Depend on children so it triggers when they change


  return (
    <div className="popup link">
      <div className ={textStyles.bodyContainer}>
        <h1>{title}</h1>
        <button className ={textStyles.buttonContainer} onClick={closeFn}>
        <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className ={textStyles.TextbodyContainer}>
          {children}
          <div ref={endOfMessagesRef} />
          </div>        
      </div>
    </div>
  );
};

export default Popup;