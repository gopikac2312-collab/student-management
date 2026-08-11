import React, { useState } from "react";
import { LayoutDashboard, Users, CalendarCheck, GraduationCap, BookOpen, FileBarChart } from "lucide-react";
import { FONT_IMPORT, COLORS } from "./constants.jsx";
import { useStore } from "./useStore.jsx";
import { Dashboard } from "./Dashboard.jsx";
import { StudentsTab } from "./Students.jsx";
import { CoursesTab } from "./Courses.jsx";
import { AttendanceTab } from "./Attendence.jsx";
import { GradesTab } from "./Grades.jsx";
import { ReportsTab } from "./Reports.jsx";


export default function RollCall() {
  const [students, setStudents, studentsLoaded] = useStore("rollcall:students", []);
  const [courses, setCourses, coursesLoaded] = useStore("rollcall:courses", []);
  const [attendance, setAttendance, attendanceLoaded] = useStore("rollcall:attendance", []);
  const [grades, setGrades, gradesLoaded] = useStore("rollcall:grades", []);
  const [tab, setTab] = useState("dashboard");

  const allLoaded = studentsLoaded && coursesLoaded && attendanceLoaded && gradesLoaded;

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
    { id: "students", label: "Students", icon: <Users size={17} /> },
    { id: "courses", label: "Courses", icon: <BookOpen size={17} /> },
    { id: "attendance", label: "Attendance", icon: <CalendarCheck size={17} /> },
    { id: "grades", label: "Grades", icon: <GraduationCap size={17} /> },
    { id: "reports", label: "Reports", icon: <FileBarChart size={17} /> },
  ];

  if (!allLoaded) {
    return (
      <div style={{ background: COLORS.board, minHeight: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Kalam', cursive", color: COLORS.chalk, fontSize: 20 }}>
        <style>{FONT_IMPORT}</style>
        
      </div>
    );
  }

  return (
    <div
      style={{
        background: COLORS.board,
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        fontFamily: "'Work Sans', sans-serif",
      }}
    >
      <style>{`
        html, body, #root { height: 100%; margin: 0; padding: 0; }
        ${FONT_IMPORT}
        .rc-scroll::-webkit-scrollbar { width: 8px; }
        .rc-scroll::-webkit-scrollbar-thumb { background: rgba(46,58,50,0.25); border-radius: 4px; }
        .rc-nav-btn:focus-visible, .rc-btn:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible {
          outline: 2px solid ${COLORS.yellow}; outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }
      `}</style>

      <div
        style={{
          width: 190,
          background: `linear-gradient(180deg, ${COLORS.wood}, ${COLORS.woodDark})`,
          padding: "20px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "0 8px 18px 8px" }}>
          <div style={{ fontFamily: "'Kalam', cursive", fontWeight: 700, fontSize: 24, color: COLORS.paper }}>RollBook</div>
          <div style={{ fontSize: 11, color: COLORS.ink, opacity: 0.75, fontFamily: "'Work Sans', sans-serif" }}>student management system</div>
        </div>
        {tabs.map((t) => (
          <button
            key={t.id}
            className="rc-nav-btn"
            onClick={() => setTab(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 10px",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              background: tab === t.id ? "rgba(17,51,79,0.12)" : "transparent",
              color: tab === t.id ? COLORS.paper : COLORS.ink,
              fontFamily: "'Work Sans', sans-serif",
              fontWeight: 600,
              fontSize: 13.5,
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="rc-scroll" style={{ flex: 1, padding: "26px 30px", overflowY: "auto", maxHeight: "100vh" }}>
        {tab === "dashboard" && <Dashboard students={students} courses={courses} attendance={attendance} grades={grades} setTab={setTab} />}
        {tab === "students" && <StudentsTab students={students} setStudents={setStudents} courses={courses} />}
        {tab === "courses" && <CoursesTab courses={courses} setCourses={setCourses} students={students} setStudents={setStudents} />}
        {tab === "attendance" && <AttendanceTab courses={courses} students={students} attendance={attendance} setAttendance={setAttendance} />}
        {tab === "grades" && <GradesTab courses={courses} students={students} grades={grades} setGrades={setGrades} />}
        {tab === "reports" && <ReportsTab students={students} courses={courses} attendance={attendance} grades={grades} />}
      </div>
    </div>
  );
}