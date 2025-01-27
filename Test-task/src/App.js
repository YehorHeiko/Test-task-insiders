import { Route, Routes } from "react-router-dom";
import TabsComponent from "./App";

const App = () => {
  const initialTabs = [
    { id: 1, name: "Dashboard", url: "/dashboard", pinned: true },
    { id: 2, name: "Banking", url: "/banking", pinned: false },
    { id: 4, name: "Accounting", url: "/accounting", pinned: false },
    { id: 5, name: "Statistics", url: "/statistics", pinned: false },
  ];

  return (
    <div>
      <TabsComponent  initialTabs={initialTabs}/>
      <Routes>
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          <Route path="/banking" element={<h1>Banking</h1>} />
          <Route path="/accounting" element={<h1>Accounting</h1>} />
          <Route path="/statistics" element={<h1>Statistics</h1>} />
        </Routes>
    </div>
  );
};

export default App;
