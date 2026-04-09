import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { Display } from "./components/Display";
import { ResultsPage } from "./components/ResultsPage";
import "./app/globals.css";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>
        <Route path="/" element={<Display />} />
        <Route path="/results/:jobId" element={<ResultsPage />} />
      </Routes>
    </div>
  );
}
