import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./lib/trpc";
import HomePage from "./pages/HomePage";
import ResultPage from "./pages/ResultPage";

const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/trpc`
        : 'http://localhost:3001/trpc',
    }),
  ],
});

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/result" component={ResultPage} />
          <Route>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600 mb-4">頁面不存在</p>
                <a href="/" className="text-purple-600 hover:underline">返回首頁</a>
              </div>
            </div>
          </Route>
        </Switch>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
