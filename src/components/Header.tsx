import { NavLink } from 'react-router-dom';
import { Logo } from './Logo';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Logo size={36} />
      </div>
      <nav className={styles.nav}>
        <NavLink
          to="/campaigns"
          className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
          end
        >
          Campaigns pipeline
        </NavLink>
        <NavLink
          to="/mailings"
          className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
        >
          Mailings
        </NavLink>
      </nav>
    </header>
  );
}
