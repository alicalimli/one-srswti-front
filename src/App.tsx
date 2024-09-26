import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <main className="bg-black">
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </main>
  );
}

export default App;
