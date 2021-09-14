import React, { ReactElement } from "react";
import { version } from "../../package.json";
function AppVersion(): ReactElement {
  return (
    <div className="px-5 py-2 bg-[#F1EFFB]">
      <div className="text-primary-darker font-oswald uppercase max-w-4xl m-auto">
        Client-Version {version}
      </div>
    </div>
  );
}

export default AppVersion;
