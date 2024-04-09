import React from "react";
import styles from './HomePage.module.css'
import "../Global.module.css";
import textStyles from '../mainButtonText.module.css'
interface HomePageProps {
  onJoin: () => void;
  onCreate: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onJoin, onCreate }) => {
  return (
    <div>
    <div className={styles.titleContainer}>
    <div className={styles.imageContainer}>
      <div className={styles.message}> WhisperLink</div>
      <div className={styles.buttonContainer}>
        <button className={textStyles.textContainer} onClick={onJoin}>Join Chatroom</button>
        <button className={textStyles.textContainer} onClick={onCreate}>Create Chatroom</button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default HomePage;
