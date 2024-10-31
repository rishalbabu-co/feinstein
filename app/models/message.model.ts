export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date;
    type: 'academic' | 'behavioral' | 'transportation' | 'general';
    read: boolean;
}