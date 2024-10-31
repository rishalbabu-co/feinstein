import { Observable } from '@nativescript/core';
import { getCurrentLocation, enableLocationRequest, isEnabled } from '@nativescript/geolocation';

export class LocationService extends Observable {
    private _currentLocation: any = null;
    private _isTracking = false;
    private _watchId: number;

    async startTracking() {
        try {
            const isLocationEnabled = await isEnabled();
            if (!isLocationEnabled) {
                await enableLocationRequest();
            }

            this._watchId = geolocation.watchLocation(
                (location) => {
                    this._currentLocation = {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        timestamp: new Date()
                    };
                    this.notifyPropertyChange('currentLocation', this._currentLocation);
                },
                (error) => console.error('Location error:', error),
                {
                    desiredAccuracy: Accuracy.high,
                    updateDistance: 10,
                    minimumUpdateTime: 1000
                }
            );
            this._isTracking = true;
        } catch (error) {
            console.error('Error starting location tracking:', error);
        }
    }

    stopTracking() {
        if (this._watchId) {
            geolocation.clearWatch(this._watchId);
            this._isTracking = false;
        }
    }

    get currentLocation() {
        return this._currentLocation;
    }

    get isTracking() {
        return this._isTracking;
    }
}