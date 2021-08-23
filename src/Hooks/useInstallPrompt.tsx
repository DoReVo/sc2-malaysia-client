import { useState } from "react";

const useInstallPrompt = (state: BeforeInstallPromptEvent | null) => {
  const promptState = useState<BeforeInstallPromptEvent | null>(state);

  return promptState;
};

export default useInstallPrompt;
