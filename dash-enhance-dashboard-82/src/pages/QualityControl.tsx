
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import { useLanguage } from '@/config/contexts/LanguageContext';

const QualityControl = () => {
  const { t } = useLanguage();
  
  return (
    <Layout title={t('qualityControlDashboard')}>
      <Dashboard />
    </Layout>
  );
};

export default QualityControl;
