import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '../../model/Notification';
import { IResponse } from '../../model/Response';

interface NotiData {
    userId: string;
    postId?: string;
    type: string;
    reason: string;
}

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private NOTIFICATION_URL = 'http://localhost:3000/notification';
    constructor(private http: HttpClient) {}

    getNotifications(id: string) {
        return this.http.get<IResponse<Array<Notification>>>(
            this.NOTIFICATION_URL,
            {
                params: {
                    userId: id,
                    populate: 'userId,postId',
                },
                withCredentials: true,
            }
        );
    }

    createNotification(data: NotiData) {
        return this.http.post<IResponse<Notification>>(
            this.NOTIFICATION_URL,
            data,
            {
                withCredentials: true,
            }
        );
    }
}
