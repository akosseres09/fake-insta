import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProfileComponent } from './list-profile.component';

describe('ProfileComponent', () => {
    let component: ListProfileComponent;
    let fixture: ComponentFixture<ListProfileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ListProfileComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ListProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
