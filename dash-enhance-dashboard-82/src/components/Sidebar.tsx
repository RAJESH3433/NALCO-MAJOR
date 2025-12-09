
import { Link, useLocation } from 'react-router-dom';
import { FileBarChart, BarChart3, LineChart, Cog, User, Bot } from 'lucide-react';
import NalcoLogo from './NalcoLogo';
import { useLanguage } from '@/config/contexts/LanguageContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, to, active }: SidebarItemProps) => {
  return (
    <Link to={to} className={`nalco-sidebar-item ${active ? 'active' : ''}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const { t } = useLanguage();

  return (
    <div className="nalco-sidebar w-60 min-h-screen flex flex-col">
      <div className="p-4">
        {/* Intentionally left empty to remove logo */}
      </div>
      
      <div className="mt-6">
        <div className="nalco-sidebar-title">{t('main')}</div>
        <div className="space-y-1 px-3 mt-2">
          <SidebarItem
            icon={<BarChart3 size={20} />}
            label={t('dashboard')}
            to="/quality-control"
            active={path === '/quality-control' || path === '/'}
          />
          <SidebarItem
            icon={<LineChart size={20} />}
            label={t('prediction')}
            to="/prediction"
            active={path === '/prediction'}
          />
          <SidebarItem
            icon={<BarChart3 size={20} />}
            label={t('optimization')}
            to="/optimization"
            active={path === '/optimization'}
          />
          <SidebarItem
            icon={<LineChart size={20} />}
            label={t('reversePrediction')}
            to="/reverse-prediction"
            active={path === '/reverse-prediction'}
          />
          <SidebarItem
            icon={<Bot size={20} />}
            label={t('llm')}
            to="/llm"
            active={path === '/llm'}
          />
        </div>
        
        <div className="nalco-sidebar-title mt-6">{t('settings')}</div>
        <div className="space-y-1 px-3 mt-2">
          <SidebarItem
            icon={<User size={20} />}
            label={t('profile')}
            to="/profile"
            active={path === '/profile'}
          />
          <SidebarItem
            icon={<Cog size={20} />}
            label={t('settingsPage')}
            to="/settings"
            active={path === '/settings'}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
