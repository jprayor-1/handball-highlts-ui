import Header from "./components/Header";

import { Display } from "./components/Display";

import "./app/globals.css";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Display />
    </div>
  );
}
