import React, { ReactElement } from "react";
import { version } from "../../package.json";
function AppVersion(): ReactElement {
  return (
    <div className="text-primary-darker font-oswald uppercase max-w-4xl m-auto">
      Client-Version {version}
    </div>
  );
}

export default AppVersion;
