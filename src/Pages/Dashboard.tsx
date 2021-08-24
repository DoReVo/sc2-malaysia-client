import React, { useEffect, useState } from "react";
import { useDrag } from "react-use-gesture";
import AppVersion from "../Components/AppVersion";
import DashboardDisplayCard from "../Components/DashboardDisplayCard";
import HeaderBar from "../Components/HeaderBar";
import RefreshPrompt from "../Components/RefreshPrompt";
import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";
import useDefaultDashboardState from "../Hooks/useDefaultDashboardState";

function Dashboard(_: RouteComponentProps): ReactElement<RouteComponentProps> {
  const { defaultCases, defaultDeaths, defaultVaccinated } =
    useDefaultDashboardState();

  const [dataInterval, setDataInterval] = useState<Dashboard.interval>("Daily");
  const [dashboardData, setDasboardData] = useState<Dashboard.DashboardData>({
    cases: { daily: defaultCases, weekly: defaultCases, monthly: defaultCases },
    deaths: {
      daily: defaultDeaths,
      weekly: defaultDeaths,
      monthly: defaultDeaths,
    },
    vaccinated: {
      daily: defaultVaccinated,
      weekly: defaultVaccinated,
      monthly: defaultVaccinated,
    },
  });

  const currentIntervalData = (): Dashboard.selectedData => {
    const lowerCaseInterval = dataInterval.toLocaleLowerCase();

    const data: Dashboard.selectedData = {
      cases: (dashboardData.cases as any)[lowerCaseInterval],
      deaths: (dashboardData.deaths as any)[lowerCaseInterval],
      vaccinated: (dashboardData.vaccinated as any)[lowerCaseInterval],
    };

    return data;
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const interval: Dashboard.interval[] = ["Daily", "Weekly", "Monthly"];

  const getData = async () => {
    const fetchData: Dashboard.DashboardData = await (
      await fetch(`${API_URL}/dashboard`)
    ).json();

    setDasboardData(fetchData);
  };

  /* Fetch data on component load */
  useEffect(() => {
    getData();
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
      swipeDistance: 5,
      swipeVelocity: 0.1,
    }
  );

  return (
    <div className="dashboard-page">
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
          data={currentIntervalData().cases.cases}
          date={currentIntervalData().cases.as_of}
          className="card-main"
          title={"Positive Cases"}
          interval={dataInterval}
          trendNumber={
            currentIntervalData()?.cases?.perfomanceBetweenInterval?.cases ??
            (null as any)
          }
        />
        <DashboardDisplayCard
          data={currentIntervalData().deaths.deaths}
          date={currentIntervalData().deaths.as_of}
          className="card-death"
          title={"Deaths"}
          interval={dataInterval}
          trendNumber={
            currentIntervalData()?.deaths?.perfomanceBetweenInterval?.deaths ??
            (null as any)
          }
        />
        <DashboardDisplayCard
          data={currentIntervalData().vaccinated.total}
          date={currentIntervalData().vaccinated.as_of}
          className="card-vaccinated"
          title={"Vaccinated"}
          interval={dataInterval}
          trendNumber={
            currentIntervalData()?.vaccinated?.perfomanceBetweenInterval
              ?.total ?? (null as any)
          }
        />
        <DashboardDisplayCard
          data={currentIntervalData().vaccinated.firstDose}
          date={currentIntervalData().vaccinated.as_of}
          title={"Dose 1"}
          className="dose"
          interval={dataInterval}
          trendNumber={
            currentIntervalData()?.vaccinated?.perfomanceBetweenInterval
              ?.firstDose ?? (null as any)
          }
        />
        <DashboardDisplayCard
          data={currentIntervalData().vaccinated.secondDose}
          date={currentIntervalData().vaccinated.as_of}
          title={"Dose 2"}
          className="dose"
          interval={dataInterval}
          trendNumber={
            currentIntervalData()?.vaccinated?.perfomanceBetweenInterval
              ?.secondDose ?? (null as any)
          }
        />
      </div>
    </div>
  );
}

export default Dashboard;
