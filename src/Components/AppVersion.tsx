import React, { ReactElement } from "react";
import { version } from "../../package.json";
function AppVersion(): ReactElement {
  return (
    <div className="text-white font-oswald uppercase">
      Client-Version {version}
    </div>
  );
}

export default AppVersion;
