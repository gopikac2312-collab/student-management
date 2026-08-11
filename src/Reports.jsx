import React from "react";
import { Download } from "lucide-react";
import { COLORS, downloadCSV } from "./constants.jsx";
import { ChalkButton, EmptyNote, SectionHeader } from "./atoms.jsx";

export function ReportsTab({ students, courses, attendance, grades }) {
  const perStudent = students.map((s) => {
    const sAtt = attendance.filter((a) => a.studentId === s.id);
    const presentCount = sAtt.filter((a) => a.status === "present" || a.status === "late").length;
    const attPct = sAtt.length ? Math.round((presentCount / sAtt.length) * 100) : null;
    const sGrades = grades.filter((g) => g.studentId === s.id);
    const avgPct = sGrades.length ? Math.round(sGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / sGrades.length) : null;
    return { ...s, attPct, avgPct };
  });

  const exportStudents = () => {
    downloadCSV("students.csv", [
      ["Name", "Roll No", "Email", "Courses"],
      ...students.map((s) => [s.name, s.rollNo, s.email || "", courses.filter((c) => (s.courseIds || []).includes(c.id)).map((c) => c.code).join("; ")]),
    ]);
  };
  const exportAttendance = () => {
    downloadCSV("attendance.csv", [
      ["Date", "Student", "Course", "Status"],
      ...attendance.map((a) => [a.date, students.find((s) => s.id === a.studentId)?.name || "Unnamed", courses.find((c) => c.id === a.courseId)?.code || "", a.status]),
    ]);
  };
  const exportGrades = () => {
    downloadCSV("grades.csv", [
      ["Student", "Course", "Assessment", "Score", "Max score", "Percent", "Date"],
      ...grades.map((g) => [
        students.find((s) => s.id === g.studentId)?.name || "Unnamed",
        courses.find((c) => c.id === g.courseId)?.code || "",
        g.assessment,
        g.score,
        g.maxScore,
        Math.round((g.score / g.maxScore) * 100),
        g.date,
      ]),
    ]);
  };
  const exportSummary = () => {
    downloadCSV("student_summary.csv", [
      ["Name", "Roll No", "Attendance %", "Average grade %"],
      ...perStudent.map((s) => [s.name, s.rollNo, s.attPct ?? "", s.avgPct ?? ""]),
    ]);
  };

  return (
    <div>
      <SectionHeader title="Reports" subtitle="Per-student summary and CSV exports" />

      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        <ChalkButton variant="chalk" onClick={exportSummary}>
          <Download size={14} /> Summary CSV
        </ChalkButton>
        <ChalkButton variant="chalk" onClick={exportStudents}>
          <Download size={14} /> Students CSV
        </ChalkButton>
        <ChalkButton variant="chalk" onClick={exportAttendance}>
          <Download size={14} /> Attendance CSV
        </ChalkButton>
        <ChalkButton variant="chalk" onClick={exportGrades}>
          <Download size={14} /> Grades CSV
        </ChalkButton>
      </div>

      {students.length === 0 ? (
        <EmptyNote text="Add students to see their summary report here." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 130px 130px", padding: "0 14px", fontSize: 11, color: COLORS.chalkDim, fontWeight: 600 }}>
            <span>Student</span>
            <span>Roll</span>
            <span>Attendance</span>
            <span>Average grade</span>
          </div>
          {perStudent.map((s) => (
            <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1fr 90px 130px 130px", alignItems: "center", background: "rgba(241,239,228,0.05)", borderRadius: 7, padding: "10px 14px" }}>
              <span style={{ color: COLORS.chalk, fontSize: 13.5 }}>{s.name}</span>
              <span style={{ color: COLORS.chalkDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>#{s.rollNo}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: s.attPct === null ? COLORS.chalkDim : s.attPct >= 75 ? "#8FCB8F" : COLORS.coral }}>
                {s.attPct === null ? "no data" : `${s.attPct}%`}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: s.avgPct === null ? COLORS.chalkDim : s.avgPct >= 60 ? "#8FCB8F" : COLORS.coral }}>
                {s.avgPct === null ? "no data" : `${s.avgPct}%`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}