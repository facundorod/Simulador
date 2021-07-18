import { Component, OnInit } from "@angular/core";
import { Sidebar } from "ng-sidebar";

@Component({
    selector: "app-panel-layout",
    templateUrl: "./panel-layout.component.html",
    styleUrls: ["./panel-layout.component.css"],
})
export class PanelLayoutComponent implements OnInit {
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
