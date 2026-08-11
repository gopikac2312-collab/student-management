const KEY = 'student_register_v1'

function seed() {
  return [
    {
      id: 'STU-001',
      name: 'Anu',
      email: 'aarav.menon@example.com',
      phone: '9847012346',
      course: 'Science',
      attendance: 90,
      grade: 'A',
      joined: '2026-06-01',
    },
    {
      id: 'STU-002',
      name: 'Fathima Rasheed',
      email: 'fathima.r@example.com',
      phone: '9847098765',
      course: 'Computer science',
      attendance: 78,
      grade: 'B+',
      joined: '2026-06-15',
    },
     {
      id: 'STU-003',
      name: 'anu',
      email: 'anu.@example.com',
      phone: '9847098767',
      course: 'maths',
      attendance: 88,
      grade: 'B+',
      joined: '2026-06-15',
    },

   

  ]

}

export function loadStudents() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      const initial = seed()
      localStorage.setItem(KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveStudents(students) {
  localStorage.setItem(KEY, JSON.stringify(students))
}

const THEME_KEY = 'student_register_theme_v1'

export function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'light'
  } catch {
    return 'light'
  }
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
}

export function nextId(students) {
  const nums = students
    .map((s) => parseInt(s.id.replace('STU-', ''), 10))
    .filter((n) => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : 0
  return `STU-${String(max + 1).padStart(3, '0')}`
}

const INSTRUCTORS_KEY = 'student_register_instructors_v1'

function seedInstructors() {
  return [
    { id: 'T-1042', name: 'Anu', subject: 'maths', courses: 3, status: 'Active', email: 'w.castillo@school.edu', joined: '2019' },
    { id: 'T-2287', name: 'Priya Nair', subject: 'science', courses: 2, status: 'Active', email: 'p.nair@school.edu', joined: '2021' },
    { id: 'T-6154', name: 'Grace ', subject: 'computer science', courses: 2, status: 'Inactive', email: 'g.lindqvist@school.edu', joined: '2015' },
  ]
}

export function loadInstructors() {
  try {
    const raw = localStorage.getItem(INSTRUCTORS_KEY)
    if (!raw) {
      const initial = seedInstructors()
      localStorage.setItem(INSTRUCTORS_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveInstructors(instructors) {
  localStorage.setItem(INSTRUCTORS_KEY, JSON.stringify(instructors))
}