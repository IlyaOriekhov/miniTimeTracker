export type EntryDTO = {
  id: number;
  date: string;
  project: string;
  hours: number;
  description: string;
};

export type DayGroupDTO = {
  date: string;
  totalHours: number;
  entries: EntryDTO[];
};

export type SummaryResponse = {
  days: DayGroupDTO[];
  grandTotalHours: number;
};
