export const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');`;

export const COLORS = {
  board: "#F5F1E6",
  boardDark: "#EDE6D3",
  chalk: "#2E3A32",
  chalkDim: "#6E7568",
  yellow: "#B8860B",
  coral: "#B0475A",
  blue: "#2E6E96",
  wood: "#e4d7b9",
  woodDark: "#D9C79C",
  woodLight: "#8A5A34",
  paper: "#194264",
  paperDark: "#7a91a2",
  ink: "#44596e",
};

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function downloadCSV(filename, rows) {
  const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}