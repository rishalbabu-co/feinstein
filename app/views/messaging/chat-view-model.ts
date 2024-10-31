import { Observable } from '@nativescript/core';
import { MessagingService } from '../../services/messaging.service';
import { Message } from '../../models/message.model';

export class ChatViewModel extends Observable {
    private _messagingService: MessagingService;
    private _messages: Message[] = [];
    private _messageText: string = '';
    private _currentUserId: string;

    constructor(userId: string) {
        super();
        this._messagingService = new MessagingService();
        this._currentUserId = userId;
        this.loadMessages();
    }

    async loadMessages() {
        this._messages = await this._messagingService.getMessages(this._currentUserId);
        this.notifyPropertyChange('messages', this._messages);
    }

    async sendMessage() {
        if (!this._messageText.trim()) return;

        const message: Message = {
            id: Date.now().toString(),
            senderId: this._currentUserId,
            receiverId: 'teacher123', // Replace with actual recipient ID
            content: this._messageText,
            timestamp: new Date(),
            type: 'general',
            read: false
        };

        await this._messagingService.sendMessage(message);
        this._messageText = '';
        this.notifyPropertyChange('messageText', '');
    }

    get messages(): Message[] {
        return this._messages;
    }

    get messageText(): string {
        return this._messageText;
    }

    set messageText(value: string) {
        if (this._messageText !== value) {
            this._messageText = value;
            this.notifyPropertyChange('messageText', value);
        }
    }

    get currentUserId(): string {
        return this._currentUserId;
    }
}