declare module Dashboard {
  type interval = "Daily" | "Weekly" | "Monthly";
  interface DashboardData {
    cases: Cases;
    deaths: Deaths;
    vaccinated: Vaccinated;
  }

  interface selectedData {
    cases: CasesData & PerfomanceData<CasesData>;
    deaths: DeathsData & PerfomanceData<DeathsData>;
    vaccinated: VaccinatedData & PerfomanceData<VaccinatedData>;
  }

  interface Cases {
    daily: CasesData & PerfomanceData<CasesData>;
    weekly: CasesData & PerfomanceData<CasesData>;
    monthly: CasesData & PerfomanceData<CasesData>;
  }

  interface Deaths {
    daily: DeathsData & PerfomanceData<DeathsData>;
    weekly: DeathsData & PerfomanceData<DeathsData>;
    monthly: DeathsData & PerfomanceData<DeathsData>;
  }

  interface Vaccinated {
    daily: VaccinatedData & PerfomanceData<VaccinatedData>;
    weekly: VaccinatedData & PerfomanceData<VaccinatedData>;
    monthly: VaccinatedData & PerfomanceData<VaccinatedData>;
  }
  interface CasesData {
    cases: number;
    as_of: string;
  }

  interface DeathsData {
    deaths: number;
    as_of: string;
  }
  interface VaccinatedData {
    total: number;
    firstDose: number;
    secondDose: number;
    as_of: string;
  }

  interface PerfomanceData<T> {
    perfomanceBetweenInterval: Partial<T>;
  }
}
