import { Observable } from '@nativescript/core';
import { Grade, Attendance } from '../../models/academic.model';

export class AcademicDashboardViewModel extends Observable {
    private _grades: Grade[] = [];
    private _attendance: Attendance[] = [];
    private _selectedTab = 0;

    constructor() {
        super();
        this.loadAcademicData();
    }

    async loadAcademicData() {
        // Simulate loading grades and attendance data
        this._grades = [
            {
                id: '1',
                studentId: 'student1',
                subject: 'Mathematics',
                score: 85,
                maxScore: 100,
                date: new Date(),
                type: 'test'
            },
            {
                id: '2',
                studentId: 'student1',
                subject: 'Science',
                score: 92,
                maxScore: 100,
                date: new Date(),
                type: 'assignment'
            }
        ];

        this._attendance = [
            {
                id: '1',
                studentId: 'student1',
                date: new Date(),
                status: 'present'
            },
            {
                id: '2',
                studentId: 'student1',
                date: new Date(Date.now() - 86400000),
                status: 'present'
            }
        ];

        this.notifyPropertyChange('grades', this._grades);
        this.notifyPropertyChange('attendance', this._attendance);
    }

    get grades(): Grade[] {
        return this._grades;
    }

    get attendance(): Attendance[] {
        return this._attendance;
    }

    get selectedTab(): number {
        return this._selectedTab;
    }

    set selectedTab(value: number) {
        if (this._selectedTab !== value) {
            this._selectedTab = value;
            this.notifyPropertyChange('selectedTab', value);
        }
    }
}