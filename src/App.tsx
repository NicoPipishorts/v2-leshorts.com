import styles from '@/components/Hello.module.css';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';

export default function App() {
  const { i18n, t } = useTranslation('common');

  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : undefined)}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? styles.active : undefined)}>
            {t('nav.about')}
          </NavLink>
        </nav>
        <div className={styles.langs}>
          <button onClick={() => i18n.changeLanguage('en')}>EN</button>
          <button onClick={() => i18n.changeLanguage('fr')}>FR</button>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
