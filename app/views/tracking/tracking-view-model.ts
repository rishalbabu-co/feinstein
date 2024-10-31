import { Observable } from '@nativescript/core';
import { TrackingService } from '../../services/tracking.service';
import { NotificationService } from '../../services/notification.service';

export class TrackingViewModel extends Observable {
    private _trackingService: TrackingService;
    private _notificationService: NotificationService;
    private _currentStudent: any;
    private _isTracking = false;
    private _statusMessage = '';
    private _mapUrl = '';

    constructor(student: any) {
        super();
        this._trackingService = new TrackingService();
        this._notificationService = NotificationService.getInstance();
        this._currentStudent = student;
        this.initialize();
    }

    async initialize() {
        await this._notificationService.initialize();
        this.updateMapUrl();
        
        this._trackingService.on('locationUpdated', (data) => {
            if (data.studentId === this._currentStudent.id) {
                this.updateLocation(data.location);
            }
        });
    }

    async toggleTracking() {
        if (this._isTracking) {
            this._trackingService.stopTracking(this._currentStudent.id);
            this._isTracking = false;
            this._statusMessage = 'Tracking stopped';
        } else {
            const geofencePoints = [
                { name: 'School', latitude: 0, longitude: 0 }, // Replace with actual coordinates
                { name: 'Bus Stop', latitude: 0, longitude: 0 } // Replace with actual coordinates
            ];
            
            await this._trackingService.startTracking(this._currentStudent.id, geofencePoints);
            this._isTracking = true;
            this._statusMessage = 'Tracking active';
            
            await this._notificationService.sendLocalNotification(
                'Tracking Started',
                `Now tracking ${this._currentStudent.name}`
            );
        }

        this.notifyPropertyChange('isTracking', this._isTracking);
        this.notifyPropertyChange('statusMessage', this._statusMessage);
    }

    private updateLocation(location: any) {
        this._currentStudent.latitude = location.latitude;
        this._currentStudent.longitude = location.longitude;
        this.updateMapUrl();
    }

    private updateMapUrl() {
        this._mapUrl = `https://maps.google.com/maps?q=${this._currentStudent.latitude},${this._currentStudent.longitude}&z=15&output=embed`;
        this.notifyPropertyChange('mapUrl', this._mapUrl);
    }

    get currentStudent() {
        return this._currentStudent;
    }

    get isTracking() {
        return this._isTracking;
    }

    get statusMessage() {
        return this._statusMessage;
    }

    get mapUrl() {
        return this._mapUrl;
    }
}