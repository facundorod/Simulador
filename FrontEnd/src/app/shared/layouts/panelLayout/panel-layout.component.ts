import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-panel-layout",
    templateUrl: "./panel-layout.component.html",
    styleUrls: ["./panel-layout.component.css"],
})
export class PanelLayoutComponent implements OnInit {
    public _opened: boolean = false;
    ngOnInit(): void {}

    toggleSidebar() {
        this._opened = !this._opened;
    }
}
