import { MainLayout } from './components/layout';
import { AppRouter } from './routes';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <MainLayout>
        <AppRouter />
      </MainLayout>
    </div>
  );
}

export default App;
