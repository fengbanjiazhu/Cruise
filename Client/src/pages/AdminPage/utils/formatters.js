// John
// Date formatter
const dateFmt = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Sydney",
  dateStyle: "medium",
  timeStyle: "short",
});

export const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFmt.format(d);
};

// Style class helpers
export const statusPillClass = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20";
    case "non-active":
      return "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-600/20";
    case "suspended":
      return "bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-600/20";
    case "pending":
      return "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-600/20";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20";
  }
};

export const incidentSeverityClass = (sev) => {
  switch (sev) {
    case "low":
      return "bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/20";
    case "medium":
      return "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-600/20";
    case "high":
      return "bg-orange-100 text-orange-700 ring-1 ring-inset ring-orange-600/20";
    case "critical":
      return "bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-600/20";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20";
  }
};

export const incidentStatusClass = (status) => {
  switch (status) {
    case "open":
      return "bg-sky-100 text-sky-700 ring-1 ring-inset ring-sky-600/20";
    case "investigating":
      return "bg-violet-100 text-violet-700 ring-1 ring-inset ring-violet-600/20";
    case "mitigated":
      return "bg-teal-100 text-teal-700 ring-1 ring-inset ring-teal-600/20";
    case "approved":
      return "bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20";
    case "rejected":
      return "bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/20";
    case "in backlog":
      return "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-600/20";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20";
  }
};
