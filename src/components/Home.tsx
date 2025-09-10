import styles from './Hello.module.css';

export default function Hello({ msg }: { msg: string }) {
  return <p className={styles.hello}>{msg}</p>;
}
