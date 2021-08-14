import React, { useEffect, useState } from "react";
import { useDrag } from "react-use-gesture";
import AppVersion from "./Components/AppVersion";
import DashboardDisplayCard from "./Components/DashboardDisplayCard";
import HeaderBar from "./Components/HeaderBar";
import RefreshPrompt from "./Components/RefreshPrompt";

function App() {
  /* 
  0 - Daily
  1 - Weekly
  2 - Monthly
  
  */
  const [dataInterval, setDataInterval] = useState<Dashboard.interval>("Daily");
  const [dashboardData, setDasboardData] = useState<Dashboard.DashboardData>({
    caseData: { cases: 0, as_of: new Date().toLocaleDateString() },
    deathData: { deaths: 0, as_of: new Date().toLocaleDateString() },
    vaccinatedData: {
      firstDose: 0,
      secondDose: 0,
      total: 0,
      as_of: new Date().toLocaleDateString(),
    },
  });

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [installed, setInstalled] = useState<boolean>(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const getData = async () => {
    const interval = dataInterval.toLocaleLowerCase();

    const caseData = await (await fetch(`${API_URL}/total/${interval}`)).json();

    const deathData = await (
      await fetch(`${API_URL}/death/${interval}`)
    ).json();

    const vaccinatedData = await (
      await fetch(`${API_URL}/vaccinated/${interval}`)
    ).json();

    setDasboardData({
      caseData,
      deathData,
      vaccinatedData,
    });
  };

  const interval: Dashboard.interval[] = ["Daily", "Weekly", "Monthly"];

  /* Fetch data on component load */
  useEffect(() => {
    getData();
  }, []);

  /* Fetch data on interval change */
  useEffect(() => {
    getData();
  }, [dataInterval]);

  // Save the install prompt
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setInstalled(false);
    });

    window.addEventListener("appinstalled", (e) => {
      e.preventDefault();
      setDeferredPrompt(null);
      setInstalled(true);
    });
  }, []);

  const bindSwipe = useDrag(
    ({ swipe: [swipeX] }) => {
      if (swipeX !== 0) {
        // Find the index of the currently selected interval
        const index = interval.findIndex(
          (interval) => interval === dataInterval
        );
        if (swipeX === -1) {
          if (index < 2) {
            setDataInterval(interval[index + 1]);
          }
        }
        if (swipeX === 1) {
          if (index > 0) {
            setDataInterval(interval[index - 1]);
          }
        }
      }
    },
    {
      filterTaps: true,
      swipeDistance: 10,
      swipeVelocity: 0.2,
    }
  );

  return (
    <div className="App">
      <div className="dashboard-page">
        <HeaderBar InstallPrompt={deferredPrompt} installed={installed} />
        <div className="interval-group">
          {interval.map((intervalName, index) => {
            return (
              <div
                onClick={() => setDataInterval(intervalName)}
                className={`interval-item${
                  dataInterval === intervalName ? " selected" : ""
                }`}
                key={index}
              >
                {intervalName}
              </div>
            );
          })}
        </div>
        <div className="dashboard-data" {...bindSwipe()}>
          <DashboardDisplayCard
            data={dashboardData.caseData.cases}
            date={dashboardData.caseData.as_of}
            className="card-main"
            title={"Positive Cases"}
            interval={dataInterval}
          />
          <DashboardDisplayCard
            data={dashboardData.deathData.deaths}
            date={dashboardData.deathData.as_of}
            className="card-death"
            title={"Deaths"}
            interval={dataInterval}
          />
          <DashboardDisplayCard
            data={dashboardData.vaccinatedData.total}
            date={dashboardData.vaccinatedData.as_of}
            className="card-vaccinated"
            title={"Vaccinated"}
            interval={dataInterval}
          />
          <DashboardDisplayCard
            data={dashboardData.vaccinatedData.firstDose}
            date={dashboardData.vaccinatedData.as_of}
            title={"Dose 1"}
            className="dose"
            interval={dataInterval}
          />
          <DashboardDisplayCard
            data={dashboardData.vaccinatedData.secondDose}
            date={dashboardData.vaccinatedData.as_of}
            title={"Dose 2"}
            className="dose"
            interval={dataInterval}
          />
        </div>
        <RefreshPrompt />
        <AppVersion />
      </div>
    </div>
  );
}

export default App;
