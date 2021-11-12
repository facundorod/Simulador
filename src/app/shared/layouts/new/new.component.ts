import { Component, OnInit } from '@angular/core';
import { Sidebar } from "ng-sidebar";

@Component({
    selector: 'app-new',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

    public sidebarOpen: boolean = false;

    ngOnInit(): void { }

    onClosed(): void {
        this.sidebarOpen = false;
    }

    openSidebar(sidebar: Sidebar): void {
        sidebar.open();
        this.sidebarOpen = true;

    }
}
