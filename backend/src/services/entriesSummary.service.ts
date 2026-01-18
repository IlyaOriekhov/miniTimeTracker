import { prisma } from "../lib/prisma";

function toYMD(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function getEntriesSummary() {
  const rows = await prisma.timeEntry.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  const map = new Map<
    string,
    { date: string; totalHours: number; entries: any[] }
  >();

  let grandTotalHours = 0;

  for (const r of rows) {
    const date = toYMD(r.date);
    const group = map.get(date) ?? { date, totalHours: 0, entries: [] };

    group.entries.push({
      id: r.id,
      date,
      project: r.project,
      hours: r.hours,
      description: r.description,
    });

    group.totalHours += r.hours;
    grandTotalHours += r.hours;

    map.set(date, group);
  }

  return {
    days: Array.from(map.values()),
    grandTotalHours,
  };
}
