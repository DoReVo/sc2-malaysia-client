import React from "react";
import { ReactElement } from "react";

interface CardProps {
  title: string;
  data: number;
}

function Card({ title, data }: CardProps): ReactElement<CardProps> {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-data">{data.toLocaleString()}</div>
    </div>
  );
}

export default Card;
