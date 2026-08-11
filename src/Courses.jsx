import React, { useState } from "react";
import { Plus, Trash2, Pencil, Check } from "lucide-react";
import { COLORS, uid } from "./constants.jsx";
import { ChalkButton, ChalkInput, Modal, EmptyNote, SectionHeader } from "./atoms.jsx";

function CourseModal({ course, onSave, onClose }) {
  const [form, setForm] = useState(course || { name: "", code: "", teacher: "" });
  return (
    <Modal title={course ? "Edit course" : "Add course"} onClose={onClose} width={380}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ChalkInput label="Course name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="World History" />
        <ChalkInput label="Course code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="HIST101" />
        <ChalkInput label="Teacher (optional)" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} placeholder="Mr. Adeyemi" />
        <div style={{ display: "flex", gap: 8, marginTop: 6, justifyContent: "flex-end" }}>
          <ChalkButton variant="chalk" onClick={onClose}>
            Cancel
          </ChalkButton>
          <ChalkButton variant="solidYellow" onClick={() => form.name.trim() && form.code.trim() && onSave(form)}>
            <Check size={15} /> Save
          </ChalkButton>
        </div>
      </div>
    </Modal>
  );
}

export function CoursesTab({ courses, setCourses, students, setStudents }) {
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const saveCourse = (form) => {
    if (form.id) {
      setCourses((prev) => prev.map((c) => (c.id === form.id ? form : c)));
    } else {
      setCourses((prev) => [...prev, { ...form, id: uid() }]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const doDelete = (course) => {
    setCourses((prev) => prev.filter((c) => c.id !== course.id));
    setStudents((prev) => prev.map((s) => ({ ...s, courseIds: (s.courseIds || []).filter((id) => id !== course.id) })));
    setConfirmDelete(null);
  };

  const countFor = (courseId) => students.filter((s) => (s.courseIds || []).includes(courseId)).length;

  return (
    <div>
      <SectionHeader
        title="Courses"
        subtitle={`${courses.length} running`}
        right={
          <ChalkButton
            variant="solidYellow"
            onClick={() => {
              setEditing(null);
              setShowModal(true);
            }}
          >
            <Plus size={15} /> Add course
          </ChalkButton>
        }
      />
      {courses.length === 0 ? (
        <EmptyNote text="No courses on the board — add your first one." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {courses.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(241,239,228,0.05)",
                borderRadius: 8,
                padding: "12px 16px",
                borderLeft: `4px solid ${COLORS.yellow}`,
              }}
            >
              <div>
                <div style={{ color: COLORS.chalk, fontWeight: 600, fontSize: 15 }}>
                  {c.name} <span style={{ color: COLORS.chalkDim, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 400 }}>{c.code}</span>
                </div>
                <div style={{ color: COLORS.chalkDim, fontSize: 12.5, marginTop: 2 }}>
                  {c.teacher ? `${c.teacher} · ` : ""}
                  {countFor(c.id)} student{countFor(c.id) !== 1 ? "s" : ""} enrolled
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <ChalkButton
                  variant="chalk"
                  onClick={() => {
                    setEditing(c);
                    setShowModal(true);
                  }}
                >
                  <Pencil size={13} />
                </ChalkButton>
                <ChalkButton variant="coral" onClick={() => setConfirmDelete(c)}>
                  <Trash2 size={13} />
                </ChalkButton>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <CourseModal
          course={editing}
          onSave={saveCourse}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
        />
      )}
      {confirmDelete && (
        <Modal title="Remove course?" onClose={() => setConfirmDelete(null)} width={360}>
          <p style={{ color: COLORS.chalk, fontSize: 14 }}>
            This removes <strong>{confirmDelete.name}</strong> and unenrolls all students from it. Attendance and grade history stay recorded.
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