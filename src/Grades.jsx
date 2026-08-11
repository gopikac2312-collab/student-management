import React, { useState, useEffect } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { COLORS, uid } from "./constants.jsx";
import { ChalkButton, ChalkInput, ChalkSelect, Modal, EmptyNote, SectionHeader } from "./atoms.jsx";

function GradeEntryModal({ courseId, students, onSave, onClose }) {
  const [assessment, setAssessment] = useState("");
  const [maxScore, setMaxScore] = useState(100);
  const [scores, setScores] = useState({});
  const roster = students.filter((s) => (s.courseIds || []).includes(courseId));

  return (
    <Modal title="Record grades" onClose={onClose} width={480}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <ChalkInput label="Assessment name" value={assessment} onChange={(e) => setAssessment(e.target.value)} placeholder="Midterm exam" style={{ flex: 1 }} />
          <ChalkInput label="Max score" type="number" min="1" value={maxScore} onChange={(e) => setMaxScore(Number(e.target.value))} style={{ width: 100 }} />
        </div>
        {roster.length === 0 ? (
          <EmptyNote text="No students enrolled in this course yet." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto" }}>
            {roster.map((s) => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <span style={{ color: COLORS.chalk, fontSize: 13.5 }}>{s.name}</span>
                <input
                  type="number"
                  min="0"
                  max={maxScore}
                  value={scores[s.id] ?? ""}
                  onChange={(e) => setScores({ ...scores, [s.id]: e.target.value })}
                  placeholder="—"
                  style={{
                    width: 70,
                    background: "rgba(241,239,228,0.08)",
                    border: `1px solid ${COLORS.chalkDim}`,
                    borderRadius: 6,
                    padding: "6px 8px",
                    color: COLORS.chalk,
                    textAlign: "center",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                />
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 6, justifyContent: "flex-end" }}>
          <ChalkButton variant="chalk" onClick={onClose}>
            Cancel
          </ChalkButton>
          <ChalkButton
            variant="solidYellow"
            disabled={!assessment.trim() || roster.length === 0}
            onClick={() => {
              const entries = Object.entries(scores)
                .filter(([, v]) => v !== "" && !isNaN(Number(v)))
                .map(([studentId, v]) => ({ id: uid(), studentId, courseId, assessment, score: Number(v), maxScore, date: new Date().toISOString().slice(0, 10) }));
              if (entries.length) onSave(entries);
            }}
          >
            <Check size={15} /> Save grades
          </ChalkButton>
        </div>
      </div>
    </Modal>
  );
}

export function GradesTab({ courses, students, grades, setGrades }) {
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!courseId && courses.length) setCourseId(courses[0].id);
  }, [courses, courseId]);

  const courseGrades = grades.filter((g) => g.courseId === courseId);
  const studentName = (id) => students.find((s) => s.id === id)?.name || "Unnamed student";

  const removeGrade = (id) => setGrades((prev) => prev.filter((g) => g.id !== id));

  const assessments = [...new Set(courseGrades.map((g) => g.assessment))];

  return (
    <div>
      <SectionHeader
        title="Grades"
        subtitle="Assessment scores by course"
        right={
          <ChalkButton variant="solidYellow" onClick={() => setShowModal(true)} disabled={!courseId}>
            <Plus size={15} /> New assessment
          </ChalkButton>
        }
      />
      <div style={{ marginBottom: 20 }}>
        <ChalkSelect label="Course" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          {courses.length === 0 && <option value="">No courses yet</option>}
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.name}
            </option>
          ))}
        </ChalkSelect>
      </div>

      {courses.length === 0 ? (
        <EmptyNote text="Add a course first, then come back to record grades." />
      ) : assessments.length === 0 ? (
        <EmptyNote text="No assessments recorded for this course yet." />
      ) : (
        assessments.map((a) => {
          const rows = courseGrades.filter((g) => g.assessment === a);
          return (
            <div key={a} style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Kalam', cursive", fontSize: 17, color: COLORS.yellow, marginBottom: 8 }}>{a}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {rows.map((g) => {
                  const pct = Math.round((g.score / g.maxScore) * 100);
                  const color = pct >= 80 ? "#8FCB8F" : pct >= 50 ? COLORS.yellow : COLORS.coral;
                  return (
                    <div key={g.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(241,239,228,0.05)", borderRadius: 7, padding: "8px 14px" }}>
                      <span style={{ color: COLORS.chalk, fontSize: 13.5 }}>{studentName(g.studentId)}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", color, fontSize: 13.5, fontWeight: 700 }}>
                          {g.score}/{g.maxScore} ({pct}%)
                        </span>
                        <button onClick={() => removeGrade(g.id)} aria-label="Delete grade" style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.chalkDim }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {showModal && (
        <GradeEntryModal
          courseId={courseId}
          students={students}
          onClose={() => setShowModal(false)}
          onSave={(entries) => {
            setGrades((prev) => [...prev, ...entries]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}