import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Button from './Button';
import { useAuthStore } from '@/store/useAuthStore';
import logo from '@/assets/logo.svg';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'transition-colors text-[1.25rem] w-[7.375rem] h-[2.6875rem] flex items-center justify-center',
    isActive
      ? 'text-(--cta-primary) font-bold'
      : 'text-(--cta2-primary-hover) hover:text-(--cta-primary) font-medium hover:font-bold'
  );

export default function Header() {
  const navigate = useNavigate();
  const {logout} = useAuthStore((state) => state);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="flex items-center gap-10 justify-between border-b border-(--gray-300) bg-(--gray-white) px-10 py-4">
      <img src={logo} alt="switchwon logo" />
      <div className='flex items-center gap-10'>
        <nav className="flex items-center gap-2">
          <NavLink to="/exchange" className={navLinkClass}>
            환전 하기
          </NavLink>
          <NavLink to="/history" className={navLinkClass}>
            환전 내역
          </NavLink>
        </nav>
        <Button
          variant="logout"
          type="button"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>
    </header>
  );
}
