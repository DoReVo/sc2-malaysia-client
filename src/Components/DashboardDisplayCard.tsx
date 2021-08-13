import React from "react";
import { ReactElement } from "react";
interface CardProps {
  title: string;
  data: number;
  date: string;
}

function DashboardDisplayCard({
  title,
  data,
  date,
}: CardProps): ReactElement<CardProps> {
  const renderDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-data">{data.toLocaleString()}</div>
      <div className="as-of-date">Latest as of {renderDate(date)}</div>
    </div>
  );
}

export default DashboardDisplayCard;
