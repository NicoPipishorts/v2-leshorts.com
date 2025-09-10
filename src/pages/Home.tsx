import { useTodos } from '@/api/todos/todos';
import Hello from '@/components/Home';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation('home');
  const { data, isLoading, isError } = useTodos();

  return (
    <section>
      <h1>{t('title')}</h1>
      <Hello msg="CSS Modules wired up ✅" />
      {isLoading && <p>{t('fetching')}</p>}
      {isError && <p>{t('error')}</p>}
      {data && (
        <ul>
          {data.slice(0, 5).map((todo) => (
            <li key={todo.id}>
              <input type="checkbox" checked={todo.completed} readOnly /> {todo.title}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
