import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation('about');
  return (
    <section>
      <h1>{t('title')}</h1>
      <p>React Router v7 + TanStack Query + i18n + Axios + CSS Modules + Vite.</p>
    </section>
  );
}
