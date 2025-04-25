import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification, NotificationWithPost } from '../../model/Notification';
import { IResponse } from '../../model/Response';
import { Observable } from 'rxjs';

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

    getUnseenNotifications(
        id: string
    ): Observable<IResponse<Array<NotificationWithPost>>> {
        return this.http.get<IResponse<Array<NotificationWithPost>>>(
            this.NOTIFICATION_URL,
            {
                params: {
                    userId: id,
                    populate: 'postId',
                    seen: 'false',
                },
                withCredentials: true,
            }
        );
    }

    setNotificationsSeen(userId: string): Observable<IResponse<Notification>> {
        return this.http.post<IResponse<Notification>>(
            this.NOTIFICATION_URL + `/${userId}`,
            {},
            {
                withCredentials: true,
            }
        );
    }

    createNotification(data: NotiData): Observable<IResponse<Notification>> {
        return this.http.post<IResponse<Notification>>(
            this.NOTIFICATION_URL,
            data,
            {
                withCredentials: true,
            }
        );
    }
}
