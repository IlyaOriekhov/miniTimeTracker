import { useEffect, useMemo, useState } from "react";
import { request } from "./api/client";
import type { SummaryResponse } from "./types";

const PROJECTS = [
  "Viso Internal",
  "Client A",
  "Client B",
  "Personal Development",
];

function todayYMD(): string {
  // <input type="date"> працює з форматом yyyy-mm-dd [web:180]
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function App() {
  const [date, setDate] = useState(todayYMD());
  const [project, setProject] = useState(PROJECTS[0]);
  const [hours, setHours] = useState<string>("1");
  const [description, setDescription] = useState("");

  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadSummary() {
    setError(null);
    const data = await request<SummaryResponse>("/entries/summary");
    setSummary(data);
  }

  useEffect(() => {
    loadSummary().catch((e) => setError(e.message));
  }, []);

  const canSave = useMemo(() => {
    const h = Number(hours);
    return (
      date &&
      project &&
      description.trim().length > 0 &&
      Number.isFinite(h) &&
      h > 0
    );
  }, [date, project, hours, description]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const h = Number(hours);
    if (!Number.isFinite(h) || h <= 0) {
      setError("Hours must be a positive number.");
      return;
    }

    setSaving(true);
    try {
      await request("/entries", {
        method: "POST",
        body: JSON.stringify({
          date, // "YYYY-MM-DD"
          project,
          hours: h,
          description,
        }),
      });

      setDescription("");
      await loadSummary();
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "24px auto",
        padding: 16,
        fontFamily: "system-ui",
      }}
    >
      <h1>Mini Time Tracker</h1>

      <form
        onSubmit={onSubmit}
        style={{
          display: "grid",
          gap: 12,
          padding: 12,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label>
          Project
          <select value={project} onChange={(e) => setProject(e.target.value)}>
            {PROJECTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label>
          Hours
          <input
            type="number"
            min="0"
            step="0.25"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </label>

        <label>
          Work description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </label>

        <button type="submit" disabled={!canSave || saving}>
          {saving ? "Saving..." : "Save"}
        </button>

        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>

      <div style={{ marginTop: 24 }}>
        <h2>Entry History</h2>

        {!summary && <div>Loading...</div>}

        {summary && (
          <>
            <div style={{ marginBottom: 12 }}>
              <strong>Grand total:</strong> {summary.grandTotalHours}
            </div>

            {summary.days.map((day) => (
              <div
                key={day.date}
                style={{
                  marginBottom: 16,
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <strong>{day.date}</strong>
                  </div>
                  <div>Total: {day.totalHours}</div>
                </div>

                <table width="100%">
                  <thead>
                    <tr>
                      <th align="left">Project</th>
                      <th align="left">Hours</th>
                      <th align="left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.entries.map((e) => (
                      <tr key={e.id}>
                        <td>{e.project}</td>
                        <td>{e.hours}</td>
                        <td>{e.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
