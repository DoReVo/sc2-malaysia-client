import { RouteComponentProps } from "@reach/router";
import { maxBy } from "lodash";
import { DateTime } from "luxon";
import React, { ReactElement, useState } from "react";
import { useEffect } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Graphs(_: RouteComponentProps): ReactElement<RouteComponentProps> {
  const [graphData, setGraphData] = useState<GraphsData | null>(null);
  const [highestStats, setHighestStats] = useState<HighestStats | null>(null);

  const getGraphData = async () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchData: GraphsData = await (
      await fetch(`${API_URL}/graphs`)
    ).json();

    fetchData.rawCases = fetchData.rawCases.map((dayCase) => {
      return { ...dayCase, cases_new: Number(dayCase.cases_new) };
    });

    fetchData.rawDeaths = fetchData.rawDeaths.map((dayDeath) => {
      return { ...dayDeath, deaths_new: Number(dayDeath.deaths_new) };
    });

    fetchData.rawVaccinated = fetchData.rawVaccinated.map((dayVaccinated) => {
      return {
        ...dayVaccinated,
        total: Number(dayVaccinated.total),
        firstDose: Number(dayVaccinated.firstDose),
        secondDose: Number(dayVaccinated.secondDose),
      };
    });

    setGraphData(fetchData);
  };

  const getCasesData = (interval: "weekly" | "monthly" = "weekly") => {
    const now = DateTime.now().startOf("day");
    const aMonthAgo = now.minus({ month: 1 });
    const aWeekAgo = now.minus({ week: 1 });

    const intervalData = graphData?.rawCases.filter((row: any) => {
      const rowDate = DateTime.fromISO(row.date);

      const condition =
        interval === "weekly"
          ? rowDate <= now && rowDate >= aWeekAgo
          : rowDate <= now && rowDate >= aMonthAgo;

      if (condition) return true;
    });

    return intervalData;
  };

  const getDeathsData = (interval: "weekly" | "monthly" = "weekly") => {
    const now = DateTime.now().startOf("day");
    const aMonthAgo = now.minus({ month: 1 });
    const aWeekAgo = now.minus({ week: 1 });

    const intervalData = graphData?.rawDeaths.filter((row: any) => {
      const rowDate = DateTime.fromISO(row.date);

      const condition =
        interval === "weekly"
          ? rowDate <= now && rowDate >= aWeekAgo
          : rowDate <= now && rowDate >= aMonthAgo;

      if (condition) return true;
    });

    return intervalData;
  };

  const getVaccinatedData = (interval: "weekly" | "monthly" = "weekly") => {
    const now = DateTime.now().startOf("day");
    const aMonthAgo = now.minus({ month: 1 });
    const aWeekAgo = now.minus({ week: 1 });

    const intervalData = graphData?.rawVaccinated.filter((row: any) => {
      const rowDate = DateTime.fromISO(row.date);

      const condition =
        interval === "weekly"
          ? rowDate <= now && rowDate >= aWeekAgo
          : rowDate <= now && rowDate >= aMonthAgo;

      if (condition) return true;
    });

    return intervalData;
  };

  const calculateHighestStats = () => {
    const hCase = maxBy(graphData?.rawCases, "cases_new");
    const hDeaths = maxBy(graphData?.rawDeaths, "deaths_new");
    const hVaccine = maxBy(graphData?.rawVaccinated, "total");

    const wHCase = maxBy(getCasesData("weekly"), "cases_new");
    const mHCase = maxBy(getCasesData("monthly"), "cases_new");

    const wHDeaths = maxBy(getDeathsData("weekly"), "deaths_new");
    const mHDeaths = maxBy(getDeathsData("monthly"), "deaths_new");

    const wHVaccinated = maxBy(getVaccinatedData("weekly"), "total");
    const mHVaccinated = maxBy(getVaccinatedData("monthly"), "total");

    setHighestStats({
      allTime: {
        rawCase: hCase!,
        rawDeath: hDeaths!,
        RawVaccinated: hVaccine!,
      },
      weeklyInterval: {
        rawCase: wHCase!,
        rawDeath: wHDeaths!,
        RawVaccinated: wHVaccinated!,
      },
      monthlyInterval: {
        rawCase: mHCase!,
        rawDeath: mHDeaths!,
        RawVaccinated: mHVaccinated!,
      },
    });
  };

  useEffect(() => {
    getGraphData();
  }, []);

  useEffect(() => {
    if (graphData) calculateHighestStats();
  }, [graphData]);

  const tickFormatter = (value: string) => {
    return DateTime.fromISO(value).toLocaleString({
      day: "numeric",
      month: "2-digit",
    });
  };

  const labelFormatter = (value: string) => {
    return DateTime.fromISO(value).toLocaleString({
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatter = (value: string, _, __) => {
    return [Number(value).toLocaleString(), "New Cases"];
  };

  return (
    <div className="graphs-page">
      <div className="card card-main graph-card-main">
        <div className="card-title">
          <div></div>
          <span>Positive Cases</span>
        </div>
        <ResponsiveContainer width="100%" className="graph-svg">
          <BarChart data={getCasesData("weekly") || []}>
            <XAxis
              dataKey={"date"}
              axisLine={false}
              tickLine={false}
              tickFormatter={tickFormatter}
              interval={6}
            />
            <Tooltip labelFormatter={labelFormatter} formatter={formatter} />
            <YAxis axisLine={false} tick={false} />
            <Line
              type="natural"
              dataKey="cases_new"
              stroke="#856BDB"
              dot={{ stroke: "#A08CE3" }}
            />
            <Bar type="" dataKey="cases_new" fill="#856BDB" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-6 grid grid-cols-6 rounded-xl">
        <li className="col-span-full text-primary font-montserrat text-sm leading-7 mb-3">
          <span className="bg-[#f36a68] text-white p-1 rounded text-xs">
            Highest recorded
          </span>{" "}
          case was{" "}
          <span className="bg-primary-lightest text-white rounded p-1 t text-xs">
            {highestStats?.allTime?.rawCase?.cases_new?.toLocaleString() || 0}
          </span>{" "}
          on{" "}
          {DateTime.fromISO(
            highestStats?.allTime?.rawCase?.date!
          )?.toLocaleString({
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </li>
        <li className="col-span-full text-primary font-montserrat text-sm leading-7 mb-3">
          Highest in the{" "}
          <span className="bg-[#f36a68] text-white p-1 rounded text-xs">
            past 7 days
          </span>{" "}
          , was{" "}
          <span className="bg-primary-lightest text-white rounded p-1 text-xs">
            {highestStats?.weeklyInterval?.rawCase?.cases_new?.toLocaleString() ||
              0}
          </span>{" "}
          on{" "}
          {DateTime.fromISO(
            highestStats?.weeklyInterval?.rawCase.date!
          ).toLocaleString({
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </li>
        <li className="col-span-full text-primary font-montserrat text-sm leading-7 mb-3">
          Highest in the{" "}
          <span className="bg-[#f36a68] text-white p-1 rounded text-xs">
            past 30 days
          </span>{" "}
          , was{" "}
          <span className="bg-primary-lightest text-white rounded p-1 text-xs">
            {highestStats?.monthlyInterval?.rawCase?.cases_new?.toLocaleString() ||
              0}
          </span>{" "}
          on{" "}
          {DateTime.fromISO(
            highestStats?.monthlyInterval?.rawCase.date!
          ).toLocaleString({
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </li>
      </div>
      {/* <div className="card card-death h-[200px]">
        <div className="card-title">
          <div></div>
          <span>Deaths</span>
        </div>
      </div>
      <div className="card card-vaccinated h-[200px]">
        <div className="card-title">
          <div></div>
          <span>Vaccinated</span>
        </div>
      </div> */}
    </div>
  );
}

export default Graphs;
