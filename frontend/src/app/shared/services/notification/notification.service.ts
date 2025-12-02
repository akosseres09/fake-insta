import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification, NotificationWithPost } from '../../model/Notification';
import { IResponse } from '../../model/Response';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface NotiData {
    userId: string;
    postId?: string;
    type: string;
    reason: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = environment.apiUrl;
    private NOTIFICATION_URL = `${this.apiUrl}notification`;
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
                    seen: 'false'
                },
                withCredentials: true
            }
        );
    }

    setNotificationsSeen(userId: string): Observable<IResponse<Notification>> {
        return this.http.post<IResponse<Notification>>(
            this.NOTIFICATION_URL + `/${userId}`,
            {},
            {
                withCredentials: true
            }
        );
    }

    createNotification(data: NotiData): Observable<IResponse<Notification>> {
        return this.http.post<IResponse<Notification>>(
            this.NOTIFICATION_URL,
            data,
            {
                withCredentials: true
            }
        );
    }
}
