import { AppRouter } from "./router/AppRouter";

export const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 via-base-100 to-base-200">
      <AppRouter />
    </div>
  );
};
