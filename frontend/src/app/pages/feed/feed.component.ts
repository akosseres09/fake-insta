import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post.component';
import { MaterialModule } from '../../material.module';
import { MiniProfileComponent } from '../mini-profile/mini-profile.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-feed',
    standalone: true,
    imports: [
        CommonModule,
        PostComponent,
        MaterialModule,
        MiniProfileComponent,
        RouterModule,
    ],
    templateUrl: './feed.component.html',
    styleUrl: './feed.component.scss',
})
export class FeedComponent {
    posts = []; /*= [
        {
            username: 'travel_guy',
            userAvatar: 'https://i.pravatar.cc/150?img=8',
            location: 'Bali, Indonesia',
            imageUrl:
                'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
            likes: 1243,
            caption: 'Paradise found 🌴 #bali #vacation #paradise',
            comments: [
                { username: 'janedoe', text: 'Looks amazing! 😍' },
                {
                    username: 'photographer',
                    text: 'Great shot! What camera did you use?',
                },
                {
                    username: 'traveler123',
                    text: 'Adding this to my bucket list!',
                },
            ],
            time: '2 hours ago',
        },
        {
            username: 'foodlover',
            userAvatar: 'https://i.pravatar.cc/150?img=10',
            location: 'Gourmet Kitchen',
            imageUrl:
                'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
            likes: 856,
            caption: 'Homemade pizza night! 🍕 #foodie #homecooking',
            comments: [
                {
                    username: 'chef_mike',
                    text: 'Looks delicious! Recipe please!',
                },
                { username: 'italian_foodie', text: 'Perfect crust!' },
            ],
            time: '5 hours ago',
        },
        {
            username: 'fitness_coach',
            userAvatar: 'https://i.pravatar.cc/150?img=12',
            location: 'Sunset Gym',
            imageUrl:
                'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
            likes: 2105,
            caption:
                'Morning workout complete! 💪 Start your day with energy! #fitness #motivation',
            comments: [
                { username: 'gym_rat', text: 'Beast mode! 💪' },
                { username: 'newbie_fitness', text: "What's your routine?" },
                { username: 'health_nut', text: 'Inspiring as always!' },
            ],
            time: '8 hours ago',
        },
    ];*/
}
