import { Observable } from '@nativescript/core';
import { LocalNotifications } from '@nativescript/local-notifications';
import { PushNotifications } from '@nativescript/push-notifications';

export class NotificationService extends Observable {
    private static instance: NotificationService;
    private _isInitialized = false;

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    async initialize() {
        if (this._isInitialized) return;

        try {
            await LocalNotifications.requestPermission();
            await PushNotifications.register({ 
                onPushTokenReceived: (token) => {
                    console.log('Push token received:', token);
                    this.updatePushToken(token);
                },
                onNotificationReceived: (notification) => {
                    console.log('Notification received:', notification);
                    this.handleNotification(notification);
                },
                showNotifications: true,
                sound: true
            });
            
            this._isInitialized = true;
        } catch (error) {
            console.error('Notification initialization error:', error);
        }
    }

    async sendLocalNotification(title: string, body: string) {
        try {
            await LocalNotifications.schedule([{
                id: Date.now(),
                title,
                body,
                sound: 'default',
                badge: 1
            }]);
        } catch (error) {
            console.error('Local notification error:', error);
        }
    }

    private async updatePushToken(token: string) {
        // Implementation to update token on server
    }

    private handleNotification(notification: any) {
        // Handle incoming notifications
        this.notify({
            eventName: 'notificationReceived',
            object: this,
            data: notification
        });
    }
}