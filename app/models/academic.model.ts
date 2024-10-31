export interface Grade {
    id: string;
    studentId: string;
    subject: string;
    score: number;
    maxScore: number;
    date: Date;
    type: 'assignment' | 'test' | 'project';
}

export interface Attendance {
    id: string;
    studentId: string;
    date: Date;
    status: 'present' | 'absent' | 'late';
    note?: string;
}