import styles from "./pixel-chatbot.module.css";

export function PixelRobotHead({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`${styles.robotHeadFrame} ${small ? styles.robotHeadFrameSmall : ""}`}
      aria-hidden="true"
    >
      <span className={styles.robotHeadIcon}>
        <span className={styles.headAntenna} />
        <span className={styles.headAntennaTip} />
        <span className={styles.headEarLeft} />
        <span className={styles.headEarRight} />
        <span className={styles.headFace}>
          <span className={styles.headEyeLeft} />
          <span className={styles.headEyeRight} />
          <span className={styles.headMouth} />
        </span>
      </span>
    </span>
  );
}

export function PixelRobot({
  small = false,
  className = "",
  greeting,
}: {
  small?: boolean;
  className?: string;
  greeting?: string;
}) {
  return (
    <span
      className={`${styles.robot} ${small ? styles.robotSmall : ""} ${greeting ? styles.robotGreeting : ""} ${className}`}
      aria-hidden="true"
    >
      {greeting && <span className={styles.robotHello}>{greeting}</span>}
      <span className={styles.antenna} />
      <span className={styles.antennaTip} />
      <span className={styles.earLeft} />
      <span className={styles.earRight} />
      <span className={styles.robotHead}>
        <span className={styles.eyeLeft} />
        <span className={styles.eyeRight} />
        <span className={styles.mouth}>
          <span />
          <span />
          <span />
        </span>
      </span>
      <span className={styles.robotBody}>
        <span className={styles.bodyLight} />
        <span className={styles.bodyMark}>B</span>
      </span>
      <span className={styles.armLeft} />
      <span className={styles.armRight} />
    </span>
  );
}
