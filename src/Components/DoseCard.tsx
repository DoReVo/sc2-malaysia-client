import React, { ReactElement } from "react";

interface Props {
  title: string;
  data: number;
}

function DoseCard({ title, data }: Props): ReactElement<Props> {
  return (
    <div className="dose-card">
      <div className="title">{title}</div>
      <div className="data">{data}</div>
    </div>
  );
}

export default DoseCard;
