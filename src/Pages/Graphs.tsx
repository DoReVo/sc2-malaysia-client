import { RouteComponentProps, useNavigate, useParams } from "@reach/router";
import { maxBy } from "lodash-es";
import { DateTime } from "luxon";
import React, { ReactElement, useEffect, useState } from "react";
import Select from "react-select";
import { useDrag } from "react-use-gesture";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface CategoryData {
  for: "cases" | "deaths" | "vaccinated";
  title: string;
  dataKey: "cases_new" | "deaths_new" | "total";
  labelKey: "New Cases" | "Deaths" | "Vaccinated";
  cardClass: "card-case" | "card-death" | "card-vaccinated";
  highlightColor: "#f36a68" | "#ffd633" | "#55d6c2";
}

function Graphs(_: RouteComponentProps): ReactElement<RouteComponentProps> {
  const [graphData, setGraphData] = useState<GraphsData | null>(null);
  const [highestStats, setHighestStats] = useState<HighestStats | null>(null);
  const [selectedInterval, setSelectedInterval] = useState({
    value: "weekly",
    label: "Weekly",
  });

  const routeCategoy = ["Cases", "Deaths", "Vaccinated"];

  const params = useParams();
  const navigate = useNavigate();

  const categoryData: CategoryData[] = [
    {
      for: "cases",
      title: "Positive Cases",
      dataKey: "cases_new",
      labelKey: "New Cases",
      cardClass: "card-case",
      highlightColor: "#ffd633",
    },
    {
      for: "deaths",
      title: "Deaths",
      dataKey: "deaths_new",
      labelKey: "Deaths",
      cardClass: "card-death",
      highlightColor: "#f36a68",
    },
    {
      for: "vaccinated",
      title: "Vaccinated",
      dataKey: "total",
      labelKey: "Vaccinated",
      cardClass: "card-vaccinated",
      highlightColor: "#55d6c2",
    },
  ];

  const bindSwipe = useDrag(
    ({ swipe: [swipeX] }) => {
      if (swipeX !== 0) {
        // Find the index of the currently selected interval
        const index = routeCategoy.findIndex(
          (category) => category.toLowerCase() === params.category
        );
        // If swiping left, go right
        if (swipeX === -1) {
          if (index < 2) {
            navigate(routeCategoy[index + 1].toLowerCase());
          }
        }
        // If swiping right, go left
        if (swipeX === 1) {
          if (index > 0) {
            navigate(routeCategoy[index - 1].toLowerCase());
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
    const aMonthAgo = now.minus({ months: 1 });
    const aWeekAgo = now.minus({ weeks: 1 });

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
    const aMonthAgo = now.minus({ months: 1 });
    const aWeekAgo = now.minus({ weeks: 1 });

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
    const aMonthAgo = now.minus({ months: 1 });
    const aWeekAgo = now.minus({ weeks: 1 });

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

  const getData: any = () => {
    const { category } = params;
    let data;

    switch (category) {
      case "cases":
        data = getCasesData(selectedInterval!.value as any);
        break;
      case "deaths":
        data = getDeathsData(selectedInterval!.value as any);
        break;
      case "vaccinated":
        data = getVaccinatedData(selectedInterval!.value as any);
        break;

      default:
        data = getCasesData(selectedInterval!.value as any);
        break;
    }

    return data;
  };

  const getStatsData = () => {
    const { category } = params;
    let data;

    switch (category) {
      case "cases":
        data = {
          allTime: {
            data: highestStats?.allTime.rawCase.cases_new,
            date: highestStats?.allTime.rawCase.date,
          },
          weekly: {
            data: highestStats?.weeklyInterval.rawCase.cases_new,
            date: highestStats?.weeklyInterval.rawCase.date,
          },
          monthly: {
            data: highestStats?.monthlyInterval.rawCase.cases_new,
            date: highestStats?.monthlyInterval.rawCase.date,
          },
        };
        break;
      case "deaths":
        data = {
          allTime: {
            data: highestStats?.allTime.rawDeath.deaths_new,
            date: highestStats?.allTime.rawDeath.date,
          },
          weekly: {
            data: highestStats?.weeklyInterval.rawDeath.deaths_new,
            date: highestStats?.weeklyInterval.rawDeath.date,
          },
          monthly: {
            data: highestStats?.monthlyInterval.rawDeath.deaths_new,
            date: highestStats?.monthlyInterval.rawDeath.date,
          },
        };
        break;
      case "vaccinated":
        data = {
          allTime: {
            data: highestStats?.allTime.RawVaccinated.total,
            date: highestStats?.allTime.RawVaccinated.date,
          },
          weekly: {
            data: highestStats?.weeklyInterval.RawVaccinated.total,
            date: highestStats?.weeklyInterval.RawVaccinated.date,
          },
          monthly: {
            data: highestStats?.monthlyInterval.RawVaccinated.total,
            date: highestStats?.monthlyInterval.RawVaccinated.date,
          },
        };
        break;

      default:
        data = {
          allTime: {
            data: highestStats?.allTime.rawCase.cases_new,
            date: highestStats?.allTime.rawCase.date,
          },
          weekly: {
            data: highestStats?.weeklyInterval.rawCase.cases_new,
            date: highestStats?.weeklyInterval.rawCase.date,
          },
          monthly: {
            data: highestStats?.monthlyInterval.rawCase.cases_new,
            date: highestStats?.monthlyInterval.rawCase.date,
          },
        };
        break;
    }

    return data;
  };

  const getCategoryData = () => {
    const { category } = params;

    let data;

    switch (category) {
      case "cases":
      case "deaths":
      case "vaccinated":
        data = categoryData.find((d) => d.for === category);
        break;
      default:
        data = categoryData.find((d) => d.for === "cases");
        break;
    }

    return data;
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
      day: "2-digit",
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

  const formatter = (value: string, _: any, __: any) => {
    return [
      Number(value).toLocaleString(),
      getCategoryData()?.labelKey || "New Cases",
    ];
  };

  const intervalSelection: any = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <div className="graphs-page" {...bindSwipe()}>
      <div className="interval-group">
        {routeCategoy.map((categoryName, index) => {
          const { category } = params;

          return (
            <div
              onClick={() => navigate(categoryName.toLowerCase())}
              className={`interval-item${
                category === categoryName.toLowerCase() ? " selected" : ""
              }`}
              key={index}
            >
              {categoryName}
            </div>
          );
        })}
      </div>
      <div
        className={`card card-main graph-card-main ${
          getCategoryData()?.cardClass
        }`}
      >
        <div className="card-title">
          <div></div>
          <span>{getCategoryData()?.title || "Positive Cases"}</span>
        </div>
        <ResponsiveContainer width="100%" className="graph-svg">
          <BarChart data={getData() || []}>
            <XAxis
              dataKey={"date"}
              axisLine={{ stroke: "#856BDB" }}
              dy={5}
              tickLine={false}
              tickFormatter={tickFormatter}
              interval="preserveStart"
              style={{
                fontSize: "0.8em",
                fontFamily: "Oswald, sans-serif",
                color: "#3a3a3a",
              }}
            />
            <Tooltip labelFormatter={labelFormatter} formatter={formatter} />
            <Bar
              dataKey={getCategoryData()?.dataKey || "cases_new"}
              fill="#937CDF"
              barSize={15}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card-interval-control">
        <Select
          isSearchable={false}
          options={intervalSelection}
          defaultValue={selectedInterval}
          onChange={(value) => setSelectedInterval(value!)}
          styles={{
            control: (style) => ({ ...style, border: "none" }),
            valueContainer: (style) => ({
              ...style,
              display: "flex",
              justifyContent: "center",
            }),
            singleValue: (style) => ({
              ...style,
              textAlign: "center",
              fontFamily: "Merriweather, sans-serif",
              fontWeight: "bold",
              letterSpacing: "1.25px",
              color: "#937CDF",
            }),
            option: (style, { isSelected }) => ({
              ...style,
              color: isSelected ? "#FFFFFF" : "#937CDF",
              fontFamily: "Merriweather, sans-serif",
              fontWeight: "bold",
              letterSpacing: "1.25px",
              backgroundColor: isSelected ? "#937CDF" : "#FFFFFF",
            }),
          }}
        ></Select>
      </div>
      <div className="bg-white p-6 grid grid-cols-6 rounded-xl">
        <li className="col-span-full text-primary font-montserrat text-sm leading-7 mb-3">
          <span
            className="text-white p-1 rounded text-xs"
            style={{ backgroundColor: getCategoryData()?.highlightColor }}
          >
            Highest recorded
          </span>{" "}
          {getCategoryData()?.for} was{" "}
          <span className="bg-primary-lightest text-white rounded p-1 t text-xs">
            {getStatsData().allTime.data?.toLocaleString() || 0}
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
          <span
            className="text-white p-1 rounded text-xs"
            style={{ backgroundColor: getCategoryData()?.highlightColor }}
          >
            past 7 days
          </span>{" "}
          , was{" "}
          <span className="bg-primary-lightest text-white rounded p-1 text-xs">
            {getStatsData().weekly.data?.toLocaleString() || 0}
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
          <span
            className="text-white p-1 rounded text-xs"
            style={{ backgroundColor: getCategoryData()?.highlightColor }}
          >
            past 30 days
          </span>{" "}
          , was{" "}
          <span className="bg-primary-lightest text-white rounded p-1 text-xs">
            {getStatsData().monthly.data?.toLocaleString() || 0}
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
