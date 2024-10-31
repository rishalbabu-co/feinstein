import { Observable } from '@nativescript/core';
import { LocationService } from '../../services/location.service';

export class DashboardViewModel extends Observable {
    private _locationService: LocationService;
    private _students = [];
    private _notifications = [];
    private _selectedTab = 0;
    private _pushNotificationsEnabled = true;

    constructor() {
        super();
        this._locationService = new LocationService();
        this.loadInitialData();
    }

    async loadInitialData() {
        // Simulate loading data
        this._students = [
            { id: '1', name: 'John Doe', grade: 'Grade 5', busId: 'BUS001' },
            { id: '2', name: 'Jane Smith', grade: 'Grade 4', busId: 'BUS002' }
        ];
        
        this._notifications = [
            {
                title: 'Bus Arrival',
                message: 'School bus will arrive in 5 minutes',
                timestamp: new Date().toLocaleTimeString()
            }
        ];

        this.notifyPropertyChange('students', this._students);
        this.notifyPropertyChange('notifications', this._notifications);
    }

    onTrackStudent(args) {
        const student = args.object.bindingContext;
        this._locationService.startTracking();
        // Implementation for tracking specific student
        console.log(`Tracking student: ${student.name}`);
    }

    onUpdateProfile() {
        // Implementation for profile update
        console.log('Updating profile...');
    }

    onLogout() {
        // Implementation for logout
        console.log('Logging out...');
    }

    get students() {
        return this._students;
    }

    get notifications() {
        return this._notifications;
    }

    get selectedTab() {
        return this._selectedTab;
    }

    get pushNotificationsEnabled() {
        return this._pushNotificationsEnabled;
    }

    set pushNotificationsEnabled(value: boolean) {
        if (this._pushNotificationsEnabled !== value) {
            this._pushNotificationsEnabled = value;
            this.notifyPropertyChange('pushNotificationsEnabled', value);
        }
    }
}