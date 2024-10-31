export interface User {
    id: string;
    name: string;
    role: 'parent' | 'teacher' | 'driver';
    email: string;
}

export interface Student {
    id: string;
    name: string;
    grade: string;
    parentId: string;
    busId: string;
    currentLocation?: {
        latitude: number;
        longitude: number;
        timestamp: Date;
    };
}