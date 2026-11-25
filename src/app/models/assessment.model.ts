export interface AssessmentSubmission {
  username: string;
  studentName: string;
  fileName: string;
  submittedAt: string;
}

export interface Assessment {
  id: number;
  title: string;
  subject: string;
  deadline: string;
  fileName: string;
  isUrgent: boolean;
  submissions: AssessmentSubmission[];
}

export const DEFAULT_ASSESSMENTS: Assessment[] = [
  {
    id: 1,
    title: 'Angular Components Assignment',
    subject: 'Introduction to Angular',
    deadline: '2026-12-20',
    fileName: 'angular-components-assignment.pdf',
    isUrgent: false,
    submissions: []
  },
  {
    id: 2,
    title: 'Binary Trees Lab Report',
    subject: 'Data Structures',
    deadline: '2026-12-14',
    fileName: 'binary-trees-lab-report.pdf',
    isUrgent: true,
    submissions: []
  },
  {
    id: 3,
    title: 'SQL Query Practice',
    subject: 'Database Management',
    deadline: '2026-12-28',
    fileName: 'sql-query-practice.pdf',
    isUrgent: false,
    submissions: []
  }
];
