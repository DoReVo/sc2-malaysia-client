declare module Dashboard {
  type interval = "Daily" | "Weekly" | "Monthly";
  interface DashboardData {
    caseData: CasesData;
    deathData: DeathsData;
    vaccinatedData: VaccinatedData;
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
}
