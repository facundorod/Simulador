import { AuthService } from "@app/services/auth.service";
import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.css"],
    providers: [AuthService],
})
export class NavbarComponent implements OnInit {
    @Input() type: any;
    constructor() {}

    ngOnInit(): void {}
}