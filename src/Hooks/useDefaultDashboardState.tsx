const useDefaultDashboardState = () => {
  const defaultCases: Dashboard.CasesData &
    Dashboard.PerfomanceData<Dashboard.CasesData> = {
    cases: 0,
    as_of: new Date().toLocaleDateString(),
    perfomanceBetweenInterval: { cases: 0 },
  };

  const defaultDeaths: Dashboard.DeathsData &
    Dashboard.PerfomanceData<Dashboard.DeathsData> = {
    deaths: 0,
    as_of: new Date().toLocaleDateString(),
    perfomanceBetweenInterval: { deaths: 0 },
  };

  const defaultVaccinated: Dashboard.VaccinatedData &
    Dashboard.PerfomanceData<Dashboard.VaccinatedData> = {
    firstDose: 0,
    secondDose: 0,
    total: 0,
    as_of: new Date().toLocaleDateString(),
    perfomanceBetweenInterval: {
      firstDose: 0,
      secondDose: 0,
      total: 0,
    },
  };

  return { defaultCases, defaultDeaths, defaultVaccinated };
};

export default useDefaultDashboardState;
