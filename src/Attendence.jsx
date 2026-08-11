import React, { useState, useEffect } from "react";
import { COLORS, uid } from "./constants.jsx";
import { ChalkButton, ChalkInput, ChalkSelect, EmptyNote, SectionHeader, ChalkCheck, ChalkCross, ChalkLate } from "./atoms.jsx";

export function AttendanceTab({ courses, students, attendance, setAttendance }) {
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [mode, setMode] = useState("mark");

  useEffect(() => {
    if (!courseId && courses.length) setCourseId(courses[0].id);
  }, [courses, courseId]);

  const roster = students.filter((s) => (s.courseIds || []).includes(courseId));

  const recordFor = (studentId) => attendance.find((a) => a.studentId === studentId && a.courseId === courseId && a.date === date);

  const setStatus = (studentId, status) => {
    setAttendance((prev) => {
      const existing = prev.find((a) => a.studentId === studentId && a.courseId === courseId && a.date === date);
      if (existing) {
        return prev.map((a) => (a.id === existing.id ? { ...a, status } : a));
      }
      return [...prev, { id: uid(), studentId, courseId, date, status }];
    });
  };

  const log = attendance.filter((a) => (courseId ? a.courseId === courseId : true)).sort((a, b) => b.date.localeCompare(a.date));

  const studentName = (id) => students.find((s) => s.id === id)?.name || "Unnamed student";
  const courseCode = (id) => courses.find((c) => c.id === id)?.code || "—";

  return (
    <div>
      <SectionHeader
        title="Attendance"
        subtitle="Mark today's roll or browse the log"
        right={
          <div style={{ display: "flex", gap: 8 }}>
            <ChalkButton variant={mode === "mark" ? "solidYellow" : "chalk"} onClick={() => setMode("mark")}>
              Mark
            </ChalkButton>
            <ChalkButton variant={mode === "log" ? "solidYellow" : "chalk"} onClick={() => setMode("log")}>
              Log
            </ChalkButton>
          </div>
        }
      />

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <ChalkSelect label="Course" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          {courses.length === 0 && <option value="">No courses yet</option>}
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.name}
            </option>
          ))}
        </ChalkSelect>
        {mode === "mark" && <ChalkInput label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />}
      </div>

      {courses.length === 0 ? (
        <EmptyNote text="Add a course first, then come back to mark attendance." />
      ) : mode === "mark" ? (
        roster.length === 0 ? (
          <EmptyNote text="No students enrolled in this course yet. Go to Students and enroll them in this course first." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {roster.map((s) => {
              const rec = recordFor(s.id);
              const btn = (status, Icon, color, aria) => (
                <button
                  onClick={() => setStatus(s.id, status)}
                  aria-label={`Mark ${s.name} ${aria}`}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    cursor: "pointer",
                    background: rec?.status === status ? `${color}33` : "transparent",
                    border: `2px solid ${rec?.status === status ? color : `${COLORS.chalkDim}55`}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon />
                </button>
              );
              return (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(46,58,50,0.045)", borderRadius: 8, padding: "10px 14px" }}>
                  <div>
                    <span style={{ color: COLORS.chalk, fontSize: 14, fontWeight: 500 }}>{s.name}</span>
                    <span style={{ color: COLORS.chalkDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, marginLeft: 8 }}>#{s.rollNo}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {btn("present", ChalkCheck, "#4E9A4E", "present")}
                    {btn("late", ChalkLate, COLORS.yellow, "late")}
                    {btn("absent", ChalkCross, COLORS.coral, "absent")}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : log.length === 0 ? (
        <EmptyNote text="No attendance recorded for this course yet." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 90px 80px", padding: "0 14px", fontSize: 11, color: COLORS.chalkDim, fontWeight: 600 }}>
            <span>Date</span>
            <span>Student</span>
            <span>Course</span>
            <span>Status</span>
          </div>
          {log.map((a) => (
            <div key={a.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr 90px 80px", alignItems: "center", background: "rgba(46,58,50,0.045)", borderRadius: 7, padding: "9px 14px", fontSize: 13 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.chalkDim }}>{a.date}</span>
              <span style={{ color: COLORS.chalk }}>{studentName(a.studentId)}</span>
              <span style={{ color: COLORS.chalkDim, fontFamily: "'JetBrains Mono', monospace" }}>{courseCode(a.courseId)}</span>
              <span
                style={{
                  color: a.status === "present" ? "#4E9A4E" : a.status === "late" ? COLORS.yellow : COLORS.coral,
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}