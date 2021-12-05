import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

@Component({
    selector: "app-my-profile",
    templateUrl: "./my-profile.component.html",
    styleUrls: ["./my-profile.component.css"],
})
export class MyProfileComponent implements OnInit {
    @ViewChild("pwd") password: ElementRef;
    constructor() {}

    ngOnInit(): void {}

    public toogleInput(): void {
        const type = this.password.nativeElement.type;
        const newType = type === "password" ? "text" : "password";
        this.password.nativeElement.type = newType;
    }
}
