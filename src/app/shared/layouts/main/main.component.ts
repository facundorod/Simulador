import { Component, OnInit } from '@angular/core';
import { Sidebar } from 'ng-sidebar';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
    public sidebarOpen: boolean = false;
    constructor() { }

    ngOnInit(): void {
    }


    openSidebar(sidebar: Sidebar): void {
        sidebar.open();
        this.sidebarOpen = true;
    }

    onClosed(): void {
        this.sidebarOpen = false;
    }

}
