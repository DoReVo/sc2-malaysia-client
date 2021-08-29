interface GraphsData {
  rawCases: RawCase[];
  rawDeaths: RawDeath[];
  rawVaccinated: RawVaccinated[];
}

interface RawVaccinated {
  date: string;
  total: number;
  firstDose: number;
  secondDose: number;
}

interface RawDeath {
  date: string;
  deaths_new: number;
}

interface RawCase {
  date: string;
  cases_new: number;
}

interface HighestStats {
  allTime: Stats;
  weeklyInterval: Stats;
  monthlyInterval: Stats;
}

interface Stats {
  rawCase: RawCase;
  rawDeath: RawDeath;
  RawVaccinated: RawVaccinated;
}
