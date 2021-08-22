declare module Dashboard {
  type interval = "Daily" | "Weekly" | "Monthly";
  interface DashboardData {
    caseData: CasesData & PerfomanceData<CasesData>;
    deathData: DeathsData & PerfomanceData<DeathsData>;
    vaccinatedData: VaccinatedData & PerfomanceData<VaccinatedData>;
  }

  interface VaccinatedData {
    total: number;
    firstDose: number;
    secondDose: number;
    as_of: string;
  }

  interface CasesData {
    cases: number;
    as_of: string;
  }

  interface DeathsData {
    deaths: number;
    as_of: string;
  }

  interface Trend<T> {
    [key: string]: number;
  }

  interface PerfomanceData<T> {
    perfomanceBetweenInterval: Partial<T>;
  }
}
