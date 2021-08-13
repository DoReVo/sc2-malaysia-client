import React, { ReactElement } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

interface Props {
  InstallPrompt: BeforeInstallPromptEvent | null;
  installed: boolean;
}

function HeaderBar({ InstallPrompt, installed }: Props): ReactElement<Props> {
  const {
    offlineReady: [offlineReady],
  } = useRegisterSW();

  const date = new Date();

  const installPWA = () => {
    if (InstallPrompt) InstallPrompt.prompt();
  };

  const isStandAlone = () => {
    if (window.matchMedia("(display-mode: standalone)").matches) return true;
    else return false;
  };

  return (
    <div className="header-bar">
      <div className="app-title">SC2-Malaysia</div>
      <div className="right-items">
        {installed && (
          <div className="app-date">Today is {date.toLocaleDateString()}</div>
        )}
        {!isStandAlone() && !installed && (
          <button className="app-install-btn" onClick={() => installPWA()}>
            Install
          </button>
        )}
      </div>
    </div>
  );
}

export default HeaderBar;
