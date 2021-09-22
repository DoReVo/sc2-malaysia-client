import { useAtom } from "jotai";
import React, { ReactElement } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { sideBarStateAtom } from "../Atoms";

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

  const [isOpen, setIsOpen] = useAtom(sideBarStateAtom);

  return (
    <div className="header-bar">
      <div className="app-title">
        <button onClick={() => setIsOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <span className="ml-3">SC2-Malaysia</span>
      </div>
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
