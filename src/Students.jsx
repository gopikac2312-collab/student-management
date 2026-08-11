import React, { useState } from "react";
import { Plus, Search, Trash2, Pencil, Check } from "lucide-react";
import { COLORS, uid } from "./constants.jsx";
import { ChalkButton, ChalkInput, ChalkSelect, Modal, EmptyNote, SectionHeader } from "./atoms.jsx";

function StudentCard({ student, courses, index, onEdit, onDelete }) {
  const tilt = index % 2 === 0 ? -1.4 : 1.4;
  const enrolledNames = courses.filter((c) => (student.courseIds || []).includes(c.id)).map((c) => c.code);
  return (
    <div
      style={{
        background: COLORS.paper,
        borderRadius: 8,
        padding: "16px 14px 14px",
        position: "relative",
        transform: `rotate(${tilt}deg)`,
        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
        width: 200,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: COLORS.coral,
          boxShadow: "0 2px 3px rgba(0,0,0,0.3)",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: COLORS.woodDark,
            border: `1.5px solid ${COLORS.woodDark}`,
            borderRadius: "50%",
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
          }}
        >
          {student.rollNo}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => onEdit(student)} aria-label={`Edit ${student.name}`} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.woodDark, padding: 2 }}>
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(student)} aria-label={`Delete ${student.name}`} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.coral, padding: 2 }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <div style={{ fontFamily: "'Kalam', cursive", fontSize: 18, color: COLORS.ink, marginTop: 8, lineHeight: 1.15 }}>{student.name}</div>
      {student.email && <div style={{ fontSize: 11, color: "#6b5f4a", marginTop: 2 }}>{student.email}</div>}
      <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 4 }}>
        {enrolledNames.length === 0 ? (
          <span style={{ fontSize: 10.5, color: "#8a7d63" }}>no courses</span>
        ) : (
          enrolledNames.map((code) => (
            <span key={code} style={{ fontSize: 10.5, background: COLORS.paperDark, color: COLORS.woodDark, padding: "2px 7px", borderRadius: 10, fontFamily: "'JetBrains Mono', monospace" }}>
              {code}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function StudentModal({ student, courses, onSave, onClose }) {
  const [form, setForm] = useState(student || { name: "", rollNo: "", email: "", courseIds: [] });
  const toggleCourse = (id) => {
    setForm((f) => ({
      ...f,
      courseIds: f.courseIds.includes(id) ? f.courseIds.filter((c) => c !== id) : [...f.courseIds, id],
    }));
  };
  return (
    <Modal title={student ? "Edit student" : "Add student"} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ChalkInput label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Amara Okafor" />
        <ChalkInput label="Roll number" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} placeholder="14" />
        <ChalkInput label="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="amara@school.edu" />
        <div>
          <span style={{ fontSize: 12, color: COLORS.chalkDim, fontWeight: 600 }}>Enrolled courses</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            {courses.length === 0 && <span style={{ color: COLORS.chalkDim, fontSize: 12 }}>No courses yet — add one in Courses.</span>}
            {courses.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCourse(c.id)}
                style={{
                  fontSize: 12,
                  padding: "5px 10px",
                  borderRadius: 12,
                  cursor: "pointer",
                  border: `1.5px solid ${form.courseIds.includes(c.id) ? COLORS.yellow : COLORS.chalkDim}`,
                  background: form.courseIds.includes(c.id) ? "rgba(232,196,104,0.15)" : "transparent",
                  color: form.courseIds.includes(c.id) ? COLORS.yellow : COLORS.chalkDim,
                }}
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 6, justifyContent: "flex-end" }}>
          <ChalkButton variant="chalk" onClick={onClose}>
            Cancel
          </ChalkButton>
          <ChalkButton variant="solidYellow" onClick={() => form.name.trim() && form.rollNo.trim() && onSave(form)}>
            <Check size={15} /> Save
          </ChalkButton>
        </div>
      </div>
    </Modal>
  );
}

export function StudentsTab({ students, setStudents, courses }) {
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = students.filter((s) => {
    const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase()) || s.rollNo.toLowerCase().includes(query.toLowerCase());
    const matchesCourse = courseFilter === "all" || (s.courseIds || []).includes(courseFilter);
    return matchesQuery && matchesCourse;
  });

  const saveStudent = (form) => {
    if (form.id) {
      setStudents((prev) => prev.map((s) => (s.id === form.id ? form : s)));
    } else {
      setStudents((prev) => [...prev, { ...form, id: uid() }]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const doDelete = (student) => {
    setStudents((prev) => prev.filter((s) => s.id !== student.id));
    setConfirmDelete(null);
  };

  return (
    <div>
      <SectionHeader
        title="Students"
        subtitle={`${students.length} on the roll`}
        right={
          <ChalkButton
            variant="solidYellow"
            onClick={() => {
              setEditing(null);
              setShowModal(true);
            }}
          >
            <Plus size={15} /> Add student
          </ChalkButton>
        }
      />
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 11, color: COLORS.chalkDim }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or roll number"
            style={{
              width: "100%",
              background: "rgba(241,239,228,0.08)",
              border: `1px solid ${COLORS.chalkDim}`,
              borderRadius: 6,
              padding: "8px 10px 8px 32px",
              color: COLORS.chalk,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <ChalkSelect value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
          <option value="all">All courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.name}
            </option>
          ))}
        </ChalkSelect>
      </div>

      {filtered.length === 0 ? (
        <EmptyNote text={students.length === 0 ? "No names on the roll yet — add your first student." : "No students match that search."} />
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 22, paddingTop: 6 }}>
          {filtered.map((s, i) => (
            <StudentCard
              key={s.id}
              student={s}
              courses={courses}
              index={i}
              onEdit={(st) => {
                setEditing(st);
                setShowModal(true);
              }}
              onDelete={setConfirmDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <StudentModal
          student={editing}
          courses={courses}
          onSave={saveStudent}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
        />
      )}
      {confirmDelete && (
        <Modal title="Remove student?" onClose={() => setConfirmDelete(null)} width={360}>
          <p style={{ color: COLORS.chalk, fontSize: 14 }}>
            This removes <strong>{confirmDelete.name}</strong> from the roster. Their attendance and grade records stay in place but will show as unnamed.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 10 }}>
            <ChalkButton variant="chalk" onClick={() => setConfirmDelete(null)}>
              Cancel
            </ChalkButton>
            <ChalkButton variant="coral" onClick={() => doDelete(confirmDelete)}>
              <Trash2 size={14} /> Remove
            </ChalkButton>
          </div>
        </Modal>
      )}
    </div>
  );
}