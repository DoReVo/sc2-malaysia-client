import React, { useEffect, useState } from "react";
import { useDrag } from "react-use-gesture";
import AppVersion from "../Components/AppVersion";
import DashboardDisplayCard from "../Components/DashboardDisplayCard";
import HeaderBar from "../Components/HeaderBar";
import RefreshPrompt from "../Components/RefreshPrompt";
import { RouteComponentProps } from "@reach/router";
import { ReactElement } from "react";

function Dashboard(_: RouteComponentProps): ReactElement<RouteComponentProps> {
  const [dataInterval, setDataInterval] = useState<Dashboard.interval>("Daily");
  const [dashboardData, setDasboardData] = useState<Dashboard.DashboardData>({
    caseData: {
      cases: 0,
      as_of: new Date().toLocaleDateString(),
      perfomanceBetweenInterval: { cases: 0 },
    },
    deathData: {
      deaths: 0,
      as_of: new Date().toLocaleDateString(),
      perfomanceBetweenInterval: { deaths: 0 },
    },
    vaccinatedData: {
      firstDose: 0,
      secondDose: 0,
      total: 0,
      as_of: new Date().toLocaleDateString(),
      perfomanceBetweenInterval: {
        firstDose: 0,
        secondDose: 0,
        total: 0,
      },
    },
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const interval: Dashboard.interval[] = ["Daily", "Weekly", "Monthly"];

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

  /* Fetch data on component load */
  useEffect(() => {
    getData();
  }, []);

  /* Fetch data on interval change */
  useEffect(() => {
    getData();
  }, [dataInterval]);

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
          data={dashboardData.caseData.cases}
          date={dashboardData.caseData.as_of}
          className="card-main"
          title={"Positive Cases"}
          interval={dataInterval}
          trendNumber={
            dashboardData?.caseData?.perfomanceBetweenInterval?.cases ??
            (null as any)
          }
        />
        <DashboardDisplayCard
          data={dashboardData.deathData.deaths}
          date={dashboardData.deathData.as_of}
          className="card-death"
          title={"Deaths"}
          interval={dataInterval}
          trendNumber={
            dashboardData?.deathData?.perfomanceBetweenInterval?.deaths ??
            (null as any)
          }
        />
        <DashboardDisplayCard
          data={dashboardData.vaccinatedData.total}
          date={dashboardData.vaccinatedData.as_of}
          className="card-vaccinated"
          title={"Vaccinated"}
          interval={dataInterval}
          trendNumber={
            dashboardData?.vaccinatedData?.perfomanceBetweenInterval?.total ??
            (null as any)
          }
        />
        <DashboardDisplayCard
          data={dashboardData.vaccinatedData.firstDose}
          date={dashboardData.vaccinatedData.as_of}
          title={"Dose 1"}
          className="dose"
          interval={dataInterval}
          trendNumber={
            dashboardData?.vaccinatedData?.perfomanceBetweenInterval
              ?.firstDose ?? (null as any)
          }
        />
        <DashboardDisplayCard
          data={dashboardData.vaccinatedData.secondDose}
          date={dashboardData.vaccinatedData.as_of}
          title={"Dose 2"}
          className="dose"
          interval={dataInterval}
          trendNumber={
            dashboardData?.vaccinatedData?.perfomanceBetweenInterval
              ?.secondDose ?? (null as any)
          }
        />
      </div>
    </div>
  );
}

export default Dashboard;
