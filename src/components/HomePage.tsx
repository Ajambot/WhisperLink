import React from "react";
import styles from './HomePage.module.css'
import textStyles from '../buttonText.module.css'
interface HomePageProps {
  onJoin: () => void;
  onCreate: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onJoin, onCreate }) => {
  return (
    <div className="homePage">
      <div className={styles.message}> WhisperLink</div>
      <div className={styles.buttonContainer}>  
        <button className={textStyles.textContainer} onClick={onJoin}>Join Chatroom</button>
        <button className={textStyles.textContainer} onClick={onCreate}>Create Chatroom</button>
      </div>
    </div>
  );
};

export default HomePage;
