import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
    @Input() type: string;
    @Input() sidebarOpen: boolean;
    constructor(private authService: AuthService) {
    }

    ngOnInit(): void { }

    public isUserAdmin(): boolean {
        return this.authService.isAdmin();
    }
}
