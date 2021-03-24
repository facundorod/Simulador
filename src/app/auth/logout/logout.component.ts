import { Component, OnInit } from "@angular/core";
import { AuthService } from "@services/auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-logout",
    templateUrl: "./logout.component.html",
    styleUrls: ["./logout.component.css"],
})
export class LogoutComponent implements OnInit {
    constructor(
        private authSvc: AuthService,
        private router: Router,
        private toast: ToastrService
    ) {}

    ngOnInit(): void {
        this.authSvc.logout();
        this.toast.toastrConfig.timeOut = 1000;
        this.toast.toastrConfig.positionClass = "toast-bottom-left";
        this.toast.toastrConfig.closeButton = true;
        this.router.navigateByUrl("/auth/login");
        this.toast.info("Goodbye!");
    }
}
