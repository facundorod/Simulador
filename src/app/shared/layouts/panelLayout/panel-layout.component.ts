import { Component, OnInit } from '@angular/core';
import { Sidebar } from 'ng-sidebar';

@Component({
    selector: 'app-panel-layout',
    templateUrl: './panel-layout.component.html',
    styleUrls: ['./panel-layout.component.css'],
     animations: [
    // trigger('headerAnimation', [
    //   state('normal', style({
    //     transform: 'translateY(0)',
    //   })),
    //   state('extended', style({
    //     transform: 'translateY(70px)',
    //   })),
    //   transition('normal => extended', animate('300ms ease-out')),
    //   transition('extended => normal', animate('300ms ease-in'))
    // ]),
  ]
})
export class PanelLayoutComponent implements OnInit {
    public sidebarOpen = false;
    public user: any;
    public toggleFlag = false;
    headerState = 'normal';

    onScroll() {
        if (window.scrollY > 50 && this.headerState === 'normal') {
        this.headerState = 'extended';
        } else if (window.scrollY <= 50 && this.headerState === 'extended') {
        this.headerState = 'normal';
        }
    }

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

    public getUserName(): string {
        if (this.user && this.user.name) {
            const splitUserName = this.user.name.split(' ');
            return splitUserName[0];
        }
        return null;
    }
}
