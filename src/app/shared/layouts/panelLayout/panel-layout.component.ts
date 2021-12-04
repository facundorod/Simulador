import { Component, OnInit } from "@angular/core";
import { Sidebar } from "ng-sidebar";

@Component({
    selector: "app-panel-layout",
    templateUrl: "./panel-layout.component.html",
    styleUrls: ["./panel-layout.component.css"],
})
export class PanelLayoutComponent implements OnInit {
    public sidebarOpen: boolean = false;
    public user: any;
    public toggleFlag = false;

    ngOnInit(): void {
        const user = JSON.parse(localStorage.getItem("authToken"));
        this.user = user.user;
        console.log(this.user);
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
