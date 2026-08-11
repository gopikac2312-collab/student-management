import React, { useMemo, useState } from "react";
import { Users, BookOpen, CalendarCheck, GraduationCap, Search } from "lucide-react";
import { COLORS } from "./constants.jsx";
import { SectionHeader, StatCard, EmptyNote } from "./atoms.jsx";

function AttendanceBarChart({ attendance }) {
  const days = useMemo(() => {
    const byDate = {};
    attendance.forEach((a) => {
      if (!byDate[a.date]) byDate[a.date] = { present: 0, total: 0 };
      byDate[a.date].total += 1;
      if (a.status === "present") byDate[a.date].present += 1;
    });
    return Object.entries(byDate)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([date, v]) => ({
        date,
        label: new Date(date).toLocaleDateString(undefined, { weekday: "short", day: "numeric" }),
        pct: v.total ? Math.round((v.present / v.total) * 100) : 0,
      }));
  }, [attendance]);

  if (days.length === 0) return <EmptyNote text="No attendance records yet — mark today's roll to start tracking." />;

  const chartHeight = 120;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: chartHeight, padding: "0 4px" }}>
        {days.map((d) => (
          <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <span style={{ fontSize: 11, color: COLORS.chalkDim, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
              {d.pct}%
            </span>
            <div
              title={`${d.label}: ${d.pct}% present`}
              style={{
                width: "100%",
                maxWidth: 30,
                height: `${Math.max((d.pct / 100) * (chartHeight - 28), 3)}px`,
                background: d.pct >= 90 ? COLORS.blue : d.pct >= 70 ? COLORS.yellow : COLORS.coral,
                borderRadius: "4px 4px 0 0",
                transition: "height 0.2s ease",
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, padding: "8px 4px 0", borderTop: `1px solid rgba(46,58,50,0.08)`, marginTop: 6 }}>
        {days.map((d) => (
          <span key={d.date} style={{ flex: 1, textAlign: "center", fontSize: 11, color: COLORS.chalkDim }}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function GradesBarChart({ grades, courses }) {
  const courseAverages = useMemo(() => {
    const byCourse = {};
    grades.forEach((g) => {
      const key = g.courseId ?? "unassigned";
      if (!byCourse[key]) byCourse[key] = { total: 0, count: 0 };
      byCourse[key].total += (g.score / g.maxScore) * 100;
      byCourse[key].count += 1;
    });
    return Object.entries(byCourse)
      .map(([courseId, v]) => {
        const course = courses.find((c) => String(c.id) === String(courseId));
        return {
          courseId,
          label: course ? course.name : "Unassigned",
          avg: Math.round(v.total / v.count),
        };
      })
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 7);
  }, [grades, courses]);

  if (courseAverages.length === 0) return <EmptyNote text="No grades recorded yet — add scores to see performance." />;

  const rowHeight = 30;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {courseAverages.map((c) => (
        <div key={c.courseId} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 92, flexShrink: 0, fontSize: 12.5, color: COLORS.chalk, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={c.label}>
            {c.label}
          </span>
          <div style={{ flex: 1, height: rowHeight - 12, background: "rgba(46,58,50,0.06)", borderRadius: 5, overflow: "hidden" }}>
            <div
              title={`${c.label}: ${c.avg}% average`}
              style={{
                width: `${Math.max(c.avg, 2)}%`,
                height: "100%",
                background: c.avg >= 80 ? COLORS.blue : c.avg >= 60 ? COLORS.yellow : COLORS.coral,
                borderRadius: 5,
                transition: "width 0.2s ease",
              }}
            />
          </div>
          <span style={{ width: 34, flexShrink: 0, textAlign: "right", fontSize: 11.5, color: COLORS.chalkDim, fontFamily: "'JetBrains Mono', monospace" }}>
            {c.avg}%
          </span>
        </div>
      ))}
    </div>
  );
}

function SearchBar({ query, setQuery }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(46,58,50,0.045)",
        border: `1px solid rgba(46,58,50,0.08)`,
        borderRadius: 8,
        padding: "8px 12px",
        marginBottom: 22,
        maxWidth: 360,
      }}
    >
      <Search size={15} color={COLORS.chalkDim} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search students or courses..."
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 13.5,
          color: COLORS.chalk,
          flex: 1,
          fontFamily: "inherit",
        }}
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          style={{
            border: "none",
            background: "none",
            color: COLORS.chalkDim,
            cursor: "pointer",
            fontSize: 13,
            padding: "2px 4px",
          }}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function Dashboard({ students, courses, attendance, grades, setTab }) {
  const [query, setQuery] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = attendance.filter((a) => a.date === today);
  const presentToday = todayRecords.filter((a) => a.status === "present").length;
  const attendancePct = todayRecords.length ? Math.round((presentToday / todayRecords.length) * 100) : null;
  const avgGrade = useMemo(() => {
    if (!grades.length) return null;
    const pct = grades.map((g) => (g.score / g.maxScore) * 100);
    return Math.round(pct.reduce((a, b) => a + b, 0) / pct.length);
  }, [grades]);

  const filteredStudents = useMemo(() => {
    if (!query.trim()) return students;
    const q = query.toLowerCase();
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || String(s.rollNo).toLowerCase().includes(q)
    );
  }, [students, query]);

  const filteredCourses = useMemo(() => {
    if (!query.trim()) return courses;
    const q = query.toLowerCase();
    return courses.filter(
      (c) => c.name.toLowerCase().includes(q) || String(c.code).toLowerCase().includes(q)
    );
  }, [courses, query]);

  return (
    <div>
      <SectionHeader title="Dashboard" subtitle="Today's classroom details" />
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 26 }}>
        <StatCard icon={<Users size={14} />} label="Students" value={students.length} accent={COLORS.blue} />
        <StatCard icon={<BookOpen size={14} />} label="Courses" value={courses.length} accent={COLORS.yellow} />
        <StatCard icon={<CalendarCheck size={14} />} label="Present today" value={attendancePct === null ? "—" : `${attendancePct}%`} accent={COLORS.coral} />
        <StatCard icon={<GraduationCap size={14} />} label="Average score" value={avgGrade === null ? "—" : `${avgGrade}%`} accent={COLORS.chalk} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 26 }}>
        <div>
          <h3 style={{ fontFamily: "'Work Sans', sans-serif", color: COLORS.yellow, fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Attendance overview</h3>
          <div style={{ background: "rgba(46,58,50,0.045)", borderRadius: 10, padding: "16px 14px" }}>
            <AttendanceBarChart attendance={attendance} />
          </div>
        </div>
        <div>
          <h3 style={{ fontFamily: "'Work Sans', sans-serif", color: COLORS.yellow, fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Grades by course</h3>
          <div style={{ background: "rgba(46,58,50,0.045)", borderRadius: 10, padding: "16px 14px" }}>
            <GradesBarChart grades={grades} courses={courses} />
          </div>
        </div>
      </div>

      <SearchBar query={query} setQuery={setQuery} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          <h3 style={{ fontFamily: "'Work Sans', sans-serif", color: COLORS.yellow, fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Student Enroll</h3>
          {filteredStudents.length === 0 ? (
            <EmptyNote text={query ? "No students match your search." : "No names on the roll yet — add your first student."} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredStudents.slice(0, 6).map((s) => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "rgba(46,58,50,0.045)", borderRadius: 7, fontSize: 13.5 }}>
                  <span style={{ color: COLORS.chalk }}>{s.name}</span>
                  <span style={{ color: COLORS.chalkDim, fontFamily: "'JetBrains Mono', monospace" }}>#{s.rollNo}</span>
                </div>
              ))}
              {filteredStudents.length > 6 && (
                <button onClick={() => setTab("students")} style={{ background: "none", border: "none", color: COLORS.blue, fontSize: 12.5, cursor: "pointer", textAlign: "left", padding: "4px 12px" }}>
                  + {filteredStudents.length - 6} more in Students
                </button>
              )}
            </div>
          )}
        </div>
        <div>
          <h3 style={{ fontFamily: "'Work Sans', sans-serif", color: COLORS.yellow, fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Courses</h3>
          {filteredCourses.length === 0 ? (
            <EmptyNote text={query ? "No courses match your search." : "No courses on the board — set one up."} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredCourses.slice(0, 6).map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "rgba(46,58,50,0.045)", borderRadius: 7, fontSize: 13.5 }}>
                  <span style={{ color: COLORS.chalk }}>{c.name}</span>
                  <span style={{ color: COLORS.chalkDim, fontFamily: "'JetBrains Mono', monospace" }}>{c.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}