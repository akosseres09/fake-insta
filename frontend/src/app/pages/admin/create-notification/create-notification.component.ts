import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user/user.service';
import { PostService } from '../../../shared/services/post/post.service';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { User } from '../../../shared/model/User';
import { Post } from '../../../shared/model/Post';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { types } from '../../../shared/model/Notification';

@Component({
    selector: 'app-create-notification',
    imports: [MatFormFieldModule, MatButtonModule, MatAutocompleteModule],
    templateUrl: './create-notification.component.html',
    styleUrl: './create-notification.component.scss',
})
export class CreateNotificationComponent implements OnInit {
    notificationForm: FormGroup;
    users?: Array<User>;
    posts?: Array<Post>;
    violationTypes = types; // from the Notification model

    constructor(
        private userService: UserService,
        private postService: PostService,
        private notiService: NotificationService,
        private formBuilder: FormBuilder
    ) {
        this.notificationForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            type: ['', [Validators.required]],
            postId: [''],
            reason: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.notificationForm
            .get('type')
            ?.valueChanges.subscribe((selectedType) => {
                const postIdControl = this.notificationForm.get('postId');
                if (selectedType === 'postViolation') {
                    postIdControl?.setValidators([Validators.required]);
                } else {
                    postIdControl?.clearValidators();
                }
                postIdControl?.updateValueAndValidity();
            });
    }
}
