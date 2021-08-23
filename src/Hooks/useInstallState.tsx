import { useState } from "react";

const useInstallState = (state: boolean) => {
  const installState = useState<boolean>(state);

  return installState;
};

export default useInstallState;
