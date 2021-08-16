import React from "react";
import { ReactElement } from "react";
interface CardProps {
  title: string;
  data: number;
  date: string;
  className?: string;
  interval: Dashboard.interval;
}

function DashboardDisplayCard({
  title,
  data,
  date,
  className,
  interval,
}: CardProps): ReactElement<CardProps> {
  const renderDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const trendText =
    interval === "Daily"
      ? "than yesterday"
      : interval === "Weekly"
      ? "than last week"
      : "than last month";

  return (
    <div className={`card${className ? ` ${className}` : ""}`}>
      <div className="card-title">
        <div></div>
        <span>{title}</span>
      </div>
      {/*  <div className="card-trend">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="red"
          className="w-[15px] h-[15px]"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <div className="trend-data">
          <span className="trend-number">26.5%</span>
          <span className="trend-text">{trendText}</span>
        </div>
      </div> */}

      <div className="card-data">{data ? data.toLocaleString() : 0}</div>
      <div className="as-of-date">updated {renderDate(date)}</div>
    </div>
  );
}

export default DashboardDisplayCard;
