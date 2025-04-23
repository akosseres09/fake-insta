import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '../../model/Notification';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private NOTIFICATION_URL = 'http://localhost:3000/notification';
    constructor(private http: HttpClient) {}

    getNotifications(id: string) {
        return this.http.get<Array<Notification>>(this.NOTIFICATION_URL, {
            params: {
                userId: id,
                populate: 'userId,postId',
            },
            withCredentials: true,
        });
    }
}
