import React, { Fragment } from "react";
import Dashboard from "./Pages/Dashboard";
import { Router } from "@reach/router";
import Graphs from "./Pages/Graphs";
import HeaderBar from "./Components/HeaderBar";
import useInstallPrompt from "./Hooks/useInstallPrompt";
import useInstallState from "./Hooks/useInstallState";
import { useEffect } from "react";
import RefreshPrompt from "./Components/RefreshPrompt";
import AppVersion from "./Components/AppVersion";
import Sidebar from "./Components/Sidebar";

function App() {
  const [prompt, setPrompt] = useInstallPrompt(null);
  const [installed, setInstalled] = useInstallState(true);

  // Save the install prompt
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setInstalled(false);
    });

    window.addEventListener("appinstalled", (e) => {
      e.preventDefault();
      setPrompt(null);
      setInstalled(true);
    });
  }, []);

  return (
    <Fragment>
      <div className="App">
        <Sidebar />
        <HeaderBar InstallPrompt={prompt} installed={installed} />
        <Router>
          <Dashboard path="/" />
          <Graphs path="/graphs/:category" />
        </Router>
        <RefreshPrompt />
      </div>
      <AppVersion />
    </Fragment>
  );
}

export default App;
