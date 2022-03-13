import { Component, OnInit } from '@angular/core';
import { Sidebar } from 'ng-sidebar';

@Component({
    selector: 'app-new',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.css'],
})
export class NewComponent implements OnInit {
    public sidebarOpen = false;
    public user: any;
    public toggleFlag = false;
    ngOnInit(): void {
        const user = JSON.parse(localStorage.getItem('authToken'));
        this.user = user.user;
    }

    onClosed(): void {
        this.sidebarOpen = false;
    }

    openSidebar(sidebar: Sidebar): void {
        sidebar.open();
        this.sidebarOpen = true;
    }
    public showMenu(): void {
        this.toggleFlag = !this.toggleFlag;
    }
}
