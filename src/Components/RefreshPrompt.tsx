import React, { ReactElement } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

function RefreshPrompt(): ReactElement {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log("SW Registered: " + r);
    },
    onRegisterError(error: any) {
      console.log("SW registration error", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div>
      {(offlineReady || needRefresh) && (
        <div className="refresh-prompt">
          <div>
            {offlineReady ? (
              <div className="info-text">App ready to work offline</div>
            ) : (
              <div className="info-text">
                New update available, click on reload to update.
              </div>
            )}
          </div>
          {needRefresh && (
            <button
              className="reload-btn"
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </button>
          )}

          <button className="close-btn" onClick={() => close()}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default RefreshPrompt;
