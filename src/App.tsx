import { Tab } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import AppVersion from "./Components/AppVersion";
import DashboardDisplayCard from "./Components/DashboardDisplayCard";
import HeaderBar from "./Components/HeaderBar";
import RefreshPrompt from "./Components/RefreshPrompt";

interface DashboardData {
  cases: number;
  deaths: number;
  vaccinated: VaccinatedData;
}

interface VaccinatedData {
  total: number;
  firstDose: number;
  secondDose: number;
}

function App() {
  /* 
  0 - Daily
  1 - Weekly
  2 - Monthly
  
  */
  const [dataInterval, setDataInterval] = useState<number | undefined>(0);
  const [dashboardData, setDasboardData] = useState<DashboardData>({
    cases: 0,
    deaths: 0,
    vaccinated: { firstDose: 0, secondDose: 0, total: 0 },
  });

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [installed, setInstalled] = useState<boolean>(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const getData = async () => {
    const interval = getInterval(dataInterval || 0);

    const { cases } = await (
      await fetch(`${API_URL}/total/${interval}`)
    ).json();

    const { deaths } = await (
      await fetch(`${API_URL}/death/${interval}`)
    ).json();

    const { total, firstDose, secondDose } = await (
      await fetch(`${API_URL}/vaccinated/${interval}`)
    ).json();

    setDasboardData({
      cases,
      deaths,
      vaccinated: {
        total,
        firstDose,
        secondDose,
      },
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
        <Tab.Panels>
          <Tab.Panel className="dashboard-data">
            <DashboardDisplayCard
              data={dashboardData.cases}
              title={"Total Cases"}
            />
            <DashboardDisplayCard
              data={dashboardData.deaths}
              title={"Total Death"}
            />
            <DashboardDisplayCard
              data={dashboardData.vaccinated.total}
              title={"Total Vaccinated"}
            />
            <DashboardDisplayCard
              data={dashboardData.vaccinated.firstDose}
              title={"1st Dose Vaccinated"}
            />
            <DashboardDisplayCard
              data={dashboardData.vaccinated.secondDose}
              title={"2st Dose Vaccinated"}
            />
          </Tab.Panel>
          <Tab.Panel className="dashboard-data">
            <DashboardDisplayCard
              data={dashboardData.cases}
              title={"Total Cases"}
            />
            <DashboardDisplayCard
              data={dashboardData.deaths}
              title={"Total Death"}
            />
            <DashboardDisplayCard
              data={dashboardData.vaccinated.total}
              title={"Total Vaccinated"}
            />
            <DashboardDisplayCard
              data={dashboardData.vaccinated.firstDose}
              title={"1st Dose Vaccinated"}
            />
            <DashboardDisplayCard
              data={dashboardData.vaccinated.secondDose}
              title={"2st Dose Vaccinated"}
            />
          </Tab.Panel>
          <Tab.Panel className="dashboard-data">
            <DashboardDisplayCard
              data={dashboardData.cases}
              title={"Total Cases"}
            />
            <DashboardDisplayCard
              data={dashboardData.deaths}
              title={"Total Death"}
            />
            <DashboardDisplayCard
              data={dashboardData.vaccinated.total}
              title={"Total Vaccinated"}
            />
            <DashboardDisplayCard
              data={dashboardData.vaccinated.firstDose}
              title={"1st Dose Vaccinated"}
            />
            <DashboardDisplayCard
              data={dashboardData.vaccinated.secondDose}
              title={"2st Dose Vaccinated"}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <RefreshPrompt />
      <AppVersion />
    </div>
  );
}

export default App;
