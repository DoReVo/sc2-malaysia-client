import React from "react";
import { ReactElement } from "react";
interface CardProps {
  title: string;
  data: number;
  date: string;
  className?: string;
  interval: Dashboard.interval;
  trendNumber: number;
}

function DashboardDisplayCard({
  title,
  data,
  date,
  trendNumber,
  className,
  interval,
}: CardProps): ReactElement<CardProps> {
  const renderDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getSvgColor = () => {
    const isCasesOrDeaths =
      className === "card-main" || className === "card-death";

    const isPositive = trendNumber > 0;

    if (isCasesOrDeaths && isPositive) return "#f36a68";
    else if (isCasesOrDeaths && !isPositive) return "#55d6c2";
    // Vaccinated card
    else if (!isCasesOrDeaths && isPositive) return "#55d6c2";
    else return "#f36a68";
  };

  const shouldRenderSvg = trendNumber !== 0;

  const svgTrend =
    trendNumber > 0 ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill={getSvgColor()}
        className="trend-svg"
      >
        <path d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" />
      </svg>
    ) : (
      <svg
        viewBox="0 0 15 15"
        fill={getSvgColor()}
        className="trend-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11.0302 9.21975C11.1709 9.3604 11.2498 9.55113 11.2498 9.75C11.2498 9.94887 11.1709 10.1396 11.0302 10.2802L8.03025 13.2803C7.8896 13.4209 7.69887 13.4998 7.5 13.4998C7.30113 13.4998 7.1104 13.4209 6.96975 13.2803L3.96975 10.2802C3.89812 10.2111 3.84098 10.1283 3.80167 10.0368C3.76237 9.9453 3.74168 9.84688 3.74081 9.7473C3.73995 9.64772 3.75892 9.54896 3.79663 9.45678C3.83434 9.36461 3.89003 9.28087 3.96045 9.21045C4.03087 9.14003 4.11461 9.08434 4.20678 9.04663C4.29896 9.00892 4.39772 8.98995 4.4973 8.99081C4.59689 8.99168 4.6953 9.01237 4.7868 9.05167C4.87831 9.09098 4.96106 9.14812 5.03025 9.21975L6.75 10.9395V2.25C6.75 2.05109 6.82902 1.86032 6.96967 1.71967C7.11032 1.57902 7.30109 1.5 7.5 1.5C7.69891 1.5 7.88968 1.57902 8.03033 1.71967C8.17098 1.86032 8.25 2.05109 8.25 2.25V10.9395L9.96975 9.21975C10.1104 9.07915 10.3011 9.00016 10.5 9.00016C10.6989 9.00016 10.8896 9.07915 11.0302 9.21975Z" />
      </svg>
    );

  return (
    <div className={`card${className ? ` ${className}` : ""}`}>
      <div className="card-title">
        <div></div>
        <span>{title}</span>
      </div>

      <div className="card-trend">
        {shouldRenderSvg && svgTrend}
        <span className="trend-number">
          {trendNumber?.toLocaleString() ?? 0}%
        </span>
      </div>

      <div className="card-data">{data ? data.toLocaleString() : 0}</div>
      <div className="as-of-date">updated {renderDate(date)}</div>
    </div>
  );
}

export default DashboardDisplayCard;
