import { Tab } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
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
  const [dataInterval, setDataInterval] = useState<number | undefined>(0);
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
    const interval = getInterval(dataInterval || 0);

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

  const getInterval = (interval: number): string => {
    switch (interval) {
      case 0:
        return "daily";
        break;
      case 1:
        return "weekly";
        break;
      case 2:
        return "monthly";
        break;

      default:
        return "daily";
        break;
    }
  };

  const interval: Dashboard.interval[] = ["daily", "weekly", "monthly"];

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
  }, []);

  return (
    <div className="App">
      <div className="dashboard-page">
        <HeaderBar InstallPrompt={deferredPrompt} installed={installed} />
        <Tab.Group
          onChange={(index) => setDataInterval(index)}
          defaultIndex={dataInterval}
        >
          <Tab.List className="interval-group">
            <Tab className="interval-item">Daily</Tab>
            <Tab className="interval-item">Weekly</Tab>
            <Tab className="interval-item">Monthly</Tab>
          </Tab.List>
          <Tab.Panels as={Fragment}>
            {interval.map((intervalName) => {
              return (
                <Tab.Panel key={intervalName} className="dashboard-data">
                  <DashboardDisplayCard
                    data={dashboardData.caseData.cases}
                    date={dashboardData.caseData.as_of}
                    className="card-main"
                    title={"Positive Cases"}
                    interval={intervalName}
                  />
                  <DashboardDisplayCard
                    data={dashboardData.deathData.deaths}
                    date={dashboardData.deathData.as_of}
                    className="card-death"
                    title={"Deaths"}
                    interval={intervalName}
                  />
                  <DashboardDisplayCard
                    data={dashboardData.vaccinatedData.total}
                    date={dashboardData.vaccinatedData.as_of}
                    className="card-vaccinated"
                    title={"Vaccinated"}
                    interval={intervalName}
                  />
                  <DashboardDisplayCard
                    data={dashboardData.vaccinatedData.firstDose}
                    date={dashboardData.vaccinatedData.as_of}
                    title={"Dose 1"}
                    className="dose"
                    interval={intervalName}
                  />
                  <DashboardDisplayCard
                    data={dashboardData.vaccinatedData.secondDose}
                    date={dashboardData.vaccinatedData.as_of}
                    title={"Dose 2"}
                    className="dose"
                    interval={intervalName}
                  />
                </Tab.Panel>
              );
            })}
          </Tab.Panels>
        </Tab.Group>
        <RefreshPrompt />
        <AppVersion />
      </div>
    </div>
  );
}

export default App;
