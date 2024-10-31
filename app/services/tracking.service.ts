import { Observable } from '@nativescript/core';
import { LocationService } from './location.service';
import { NotificationService } from './notification.service';

export class TrackingService extends Observable {
    private _locationService: LocationService;
    private _notificationService: NotificationService;
    private _activeTracking: Map<string, any> = new Map();
    private _geofenceRadius = 100; // meters

    constructor() {
        super();
        this._locationService = new LocationService();
        this._notificationService = NotificationService.getInstance();
    }

    async startTracking(studentId: string, geofencePoints: any[]) {
        if (this._activeTracking.has(studentId)) {
            return;
        }

        const tracking = {
            studentId,
            geofencePoints,
            lastLocation: null
        };

        this._activeTracking.set(studentId, tracking);
        await this._locationService.startTracking();

        this._locationService.on('locationChanged', (location) => {
            this.handleLocationUpdate(studentId, location);
        });
    }

    stopTracking(studentId: string) {
        if (this._activeTracking.has(studentId)) {
            this._activeTracking.delete(studentId);
            if (this._activeTracking.size === 0) {
                this._locationService.stopTracking();
            }
        }
    }

    private async handleLocationUpdate(studentId: string, location: any) {
        const tracking = this._activeTracking.get(studentId);
        if (!tracking) return;

        tracking.lastLocation = location;
        this.checkGeofences(tracking);
        
        this.notify({
            eventName: 'locationUpdated',
            object: this,
            data: { studentId, location }
        });
    }

    private async checkGeofences(tracking: any) {
        const currentLocation = tracking.lastLocation;
        
        for (const point of tracking.geofencePoints) {
            const distance = this.calculateDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                point.latitude,
                point.longitude
            );

            if (distance <= this._geofenceRadius) {
                await this._notificationService.sendLocalNotification(
                    'Location Alert',
                    `Student has reached ${point.name}`
                );
            }
        }
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }
}