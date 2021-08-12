import React, { ReactElement } from "react";

function HeaderBar(): ReactElement {
  const date = new Date();
  return (
    <div className="header-bar">
      <div className="app-title">SC2-Malaysia</div>
      <div className="app-date">{date.toLocaleDateString()}</div>
    </div>
  );
}

export default HeaderBar;
