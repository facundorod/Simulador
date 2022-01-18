function _classCallCheck(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,n){for(var e=0;e<n.length;e++){var o=n[e];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function _createClass(t,n,e){return n&&_defineProperties(t.prototype,n),e&&_defineProperties(t,e),t}(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{tRQ3:function(t,n,e){"use strict";e.r(n),e.d(n,"AuthorizationModule",(function(){return w}));var o,i,r,c,a,s,l=e("lGQG"),b=e("3Pt+"),u=e("fXoL"),g=e("tyNb"),m=e("5eHb"),d=((o=function(){function t(n,e,o){_classCallCheck(this,t),this.authSvc=n,this.router=e,this.toast=o}return _createClass(t,[{key:"ngOnInit",value:function(){this.authSvc.logout(),this.toast.toastrConfig.timeOut=1e3,this.toast.toastrConfig.positionClass="toast-bottom-left",this.toast.toastrConfig.closeButton=!0,this.router.navigateByUrl("/auth/login"),this.toast.info("Goodbye!")}}]),t}()).\u0275fac=function(t){return new(t||o)(u.Nb(l.a),u.Nb(g.b),u.Nb(m.b))},o.\u0275cmp=u.Hb({type:o,selectors:[["app-logout"]],decls:0,vars:0,template:function(t,n){},styles:[""]}),o),f=e("AytR"),p=e("XNiG"),h=e("nm5K"),C=((i=function(){function t(n){_classCallCheck(this,t),this.api=n}return _createClass(t,[{key:"getMonitorConfiguration",value:function(){var t=new p.a;return this.api.httpGet(f.a.api.simulations+"monitor").subscribe((function(n){t.next(n)}),(function(t){console.error(t)}),(function(){t.complete()})),t.asObservable()}},{key:"updateMonitorConfiguration",value:function(t){var n=new p.a;return this.api.httpPut(f.a.api.simulations+"monitor",t).subscribe((function(){n.next()}),(function(t){console.error(t)}),(function(){n.complete()})),n.asObservable()}}]),t}()).\u0275fac=function(t){return new(t||i)(u.ac(h.a))},i.\u0275prov=u.Jb({token:i,factory:i.\u0275fac}),i),v=function(){return["/auth/register"]},M=((r=function(){function t(n,e,o,i){_classCallCheck(this,t),this.authService=n,this.toast=e,this.router=o,this.monitorConfiguration=i,this.submit=!1}return _createClass(t,[{key:"login",value:function(){var t=this;this.toast.toastrConfig.timeOut=1e3,this.toast.toastrConfig.positionClass="toast-bottom-left",this.toast.toastrConfig.closeButton=!0,this.authService.login(this.email,this.password).subscribe((function(){t.router.navigateByUrl("/simulation/new"),t.submit=!0,t.toast.success("Login successful... Welcome"),JSON.parse(localStorage.getItem("authToken")).user.roles.includes("admin")&&t.loadMonitorConfiguration()}),(function(t){console.log(t)}))}},{key:"ngOnInit",value:function(){}},{key:"loadMonitorConfiguration",value:function(){this.monitorConfiguration.getMonitorConfiguration().subscribe((function(t){t&&localStorage.setItem("monitor",JSON.stringify(t))}),(function(t){console.error(t)}))}}]),t}()).\u0275fac=function(t){return new(t||r)(u.Nb(l.a),u.Nb(m.b),u.Nb(g.b),u.Nb(C))},r.\u0275cmp=u.Hb({type:r,selectors:[["app-login"]],decls:35,vars:5,consts:[[1,"card"],[1,"card-header"],[1,"img-header"],["src","https://img.icons8.com/color/100/000000/test-account.png","alt","Profile Img","title","Profile Img",1,"profile-img"],[1,"text-header"],[1,"text-center"],[1,"card-body"],[1,"form-login"],["loginForm","ngForm"],[1,"form-group"],["for","usuario"],[1,"input-group"],[1,"input-group-text"],["src","https://img.icons8.com/fluency/24/000000/username.png"],["type","text","name","email","required","",1,"form-control",3,"ngModel","ngModelChange"],["user","ngModel"],["for","psw"],["src","https://img.icons8.com/fluency/24/000000/lock-2.png"],["type","password","name","password","required","",1,"form-control",3,"ngModel","ngModelChange"],["psw","ngModel"],["type","submit",1,"btn","btn-primary","btn-block","btn-login",3,"disabled","click"],["src","https://img.icons8.com/color-glass/24/000000/login-rounded-right.png","alt","signIn","title","SignIn"],[1,"form-group","mt-3"],[3,"routerLink"]],template:function(t,n){if(1&t&&(u.Sb(0,"div",0),u.Sb(1,"div",1),u.Sb(2,"div",2),u.Ob(3,"img",3),u.Rb(),u.Sb(4,"div",4),u.Sb(5,"h3",5),u.Ec(6," Please, login with your credentials "),u.Rb(),u.Rb(),u.Sb(7,"div",6),u.Sb(8,"div",7),u.Sb(9,"form",null,8),u.Sb(11,"div",9),u.Sb(12,"label",10),u.Ec(13," User "),u.Rb(),u.Sb(14,"div",11),u.Sb(15,"div",12),u.Ob(16,"img",13),u.Rb(),u.Sb(17,"input",14,15),u.ec("ngModelChange",(function(t){return n.email=t})),u.Rb(),u.Rb(),u.Rb(),u.Sb(19,"div",9),u.Sb(20,"label",16),u.Ec(21," Password "),u.Rb(),u.Sb(22,"div",11),u.Sb(23,"div",12),u.Ob(24,"img",17),u.Rb(),u.Sb(25,"input",18,19),u.ec("ngModelChange",(function(t){return n.password=t})),u.Rb(),u.Rb(),u.Rb(),u.Sb(27,"button",20),u.ec("click",(function(){return n.login()})),u.Ob(28,"img",21),u.Ec(29,"Sign In "),u.Rb(),u.Rb(),u.Sb(30,"div",22),u.Sb(31,"p"),u.Ec(32," Do you not have an account? "),u.Sb(33,"a",23),u.Ec(34," Register here."),u.Rb(),u.Rb(),u.Rb(),u.Rb(),u.Rb(),u.Rb(),u.Rb()),2&t){var e=u.uc(10);u.zb(17),u.mc("ngModel",n.email),u.zb(8),u.mc("ngModel",n.password),u.zb(2),u.mc("disabled",!e.form.valid),u.zb(6),u.mc("routerLink",u.pc(4,v))}},directives:[b.y,b.m,b.n,b.b,b.u,b.l,b.o,g.c],styles:[".card[_ngcontent-%COMP%]{margin-top:10%;min-height:450px;max-height:80%;background-color:#f3f1f5}.profile-img[_ngcontent-%COMP%]{width:70%;margin-left:15%;position:relative;bottom:40%}.card-header[_ngcontent-%COMP%]{display:flex;justify-content:center;border-bottom:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;background-color:#f3f1f5}.text-header[_ngcontent-%COMP%]{position:absolute;margin-top:20%}.text-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:1em}.card-body[_ngcontent-%COMP%]{position:absolute;top:5%}.form-login[_ngcontent-%COMP%]{margin-top:30%}.btn-login[_ngcontent-%COMP%]{background-color:#8e7cc3;border-color:#8e7cc3}.btn-login[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{margin-right:2%}.btn-login[_ngcontent-%COMP%]:active, .btn-login[_ngcontent-%COMP%]:focus, .btn-login[_ngcontent-%COMP%]:hover, .btn-login[_ngcontent-%COMP%]:link, .btn-login[_ngcontent-%COMP%]:visited{background-color:#f3f1f5;color:#8e7cc3}@media (min-width:1024px){.profile-img[_ngcontent-%COMP%]{width:auto;margin-left:auto}.card[_ngcontent-%COMP%]{margin-top:3%}.text-header[_ngcontent-%COMP%]{position:absolute;margin-top:8%}.text-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:1.5em}.card-body[_ngcontent-%COMP%]{top:0;width:50%}}"]}),r),S=function(){return["/auth/login"]},O=((c=function(){function t(n,e,o){_classCallCheck(this,t),this.authService=n,this.toast=e,this.router=o}return _createClass(t,[{key:"ngOnInit",value:function(){}},{key:"sign",value:function(){var t=this;this.toast.toastrConfig.timeOut=1e3,this.toast.toastrConfig.positionClass="toast-bottom-full-width",this.authService.register({email:this.email,name:this.name,surname:this.surname,password:this.password,institution:this.institution}).subscribe((function(){t.router.navigateByUrl("/auth/login"),t.toast.success("Your account has been created")}))}}]),t}()).\u0275fac=function(t){return new(t||c)(u.Nb(l.a),u.Nb(m.b),u.Nb(g.b))},c.\u0275cmp=u.Hb({type:c,selectors:[["app-register"]],decls:52,vars:7,consts:[[1,"card"],[1,"card-header"],[1,"img-header"],["src","https://img.icons8.com/color/100/000000/test-account.png","alt","Profile Img","title","Profile Img",1,"profile-img"],[1,"text-header"],[1,"text-center"],[1,"card-body"],[1,"form-register"],[1,"form-row"],[1,"form-group","col-md-6"],["for","inputEmail4"],[1,"input-group"],[1,"input-group-text"],["src","https://img.icons8.com/external-itim2101-flat-itim2101/24/000000/external-email-digital-marketing-itim2101-flat-itim2101.png"],["type","email","id","inputEmail4","name","email",1,"form-control",3,"ngModel","ngModelChange"],["for","inputPassword4"],["src","https://img.icons8.com/fluency/24/000000/lock-2.png"],["type","password","id","inputPassword4","name","password",1,"form-control",3,"ngModel","ngModelChange"],[1,"form-group"],["for","inputName"],["src","https://img.icons8.com/fluency/24/000000/employee-card.png"],["type","text","id","inputName","name","name",1,"form-control",3,"ngModel","ngModelChange"],["for","inputSurname"],["type","text","id","inputSurname","name","surname",1,"form-control",3,"ngModel","ngModelChange"],["for","inputInstitution"],["src","https://img.icons8.com/office/24/000000/organization.png"],["type","text","id","inputInstitution","name","institution",1,"form-control",3,"ngModel","ngModelChange"],["type","submit",1,"btn","btn-primary","btn-block","btn-register",3,"click"],[1,"form-group","mt-3"],[3,"routerLink"]],template:function(t,n){1&t&&(u.Sb(0,"div",0),u.Sb(1,"div",1),u.Sb(2,"div",2),u.Ob(3,"img",3),u.Rb(),u.Sb(4,"div",4),u.Sb(5,"h3",5),u.Ec(6," Register "),u.Rb(),u.Rb(),u.Sb(7,"div",6),u.Sb(8,"form",7),u.Sb(9,"div",8),u.Sb(10,"div",9),u.Sb(11,"label",10),u.Ec(12,"Email"),u.Rb(),u.Sb(13,"div",11),u.Sb(14,"div",12),u.Ob(15,"img",13),u.Rb(),u.Sb(16,"input",14),u.ec("ngModelChange",(function(t){return n.email=t})),u.Rb(),u.Rb(),u.Rb(),u.Sb(17,"div",9),u.Sb(18,"label",15),u.Ec(19,"Password"),u.Rb(),u.Sb(20,"div",11),u.Sb(21,"div",12),u.Ob(22,"img",16),u.Rb(),u.Sb(23,"input",17),u.ec("ngModelChange",(function(t){return n.password=t})),u.Rb(),u.Rb(),u.Rb(),u.Rb(),u.Sb(24,"div",18),u.Sb(25,"label",19),u.Ec(26,"Name"),u.Rb(),u.Sb(27,"div",11),u.Sb(28,"div",12),u.Ob(29,"img",20),u.Rb(),u.Sb(30,"input",21),u.ec("ngModelChange",(function(t){return n.name=t})),u.Rb(),u.Rb(),u.Rb(),u.Sb(31,"div",18),u.Sb(32,"label",22),u.Ec(33,"Surname"),u.Rb(),u.Sb(34,"div",11),u.Sb(35,"div",12),u.Ob(36,"img",20),u.Rb(),u.Sb(37,"input",23),u.ec("ngModelChange",(function(t){return n.surname=t})),u.Rb(),u.Rb(),u.Rb(),u.Sb(38,"div",18),u.Sb(39,"label",24),u.Ec(40," Institution "),u.Rb(),u.Sb(41,"div",11),u.Sb(42,"div",12),u.Ob(43,"img",25),u.Rb(),u.Sb(44,"input",26),u.ec("ngModelChange",(function(t){return n.institution=t})),u.Rb(),u.Rb(),u.Rb(),u.Sb(45,"button",27),u.ec("click",(function(){return n.sign()})),u.Ec(46," Create account "),u.Rb(),u.Rb(),u.Sb(47,"div",28),u.Sb(48,"p"),u.Ec(49,"Do you have an account? Please, "),u.Sb(50,"a",29),u.Ec(51," sign in here "),u.Rb(),u.Rb(),u.Rb(),u.Rb(),u.Rb(),u.Rb()),2&t&&(u.zb(16),u.mc("ngModel",n.email),u.zb(7),u.mc("ngModel",n.password),u.zb(7),u.mc("ngModel",n.name),u.zb(7),u.mc("ngModel",n.surname),u.zb(7),u.mc("ngModel",n.institution),u.zb(6),u.mc("routerLink",u.pc(6,S)))},directives:[b.y,b.m,b.n,b.b,b.l,b.o,g.c],styles:[".card-header[_ngcontent-%COMP%]{display:flex;justify-content:center;border-bottom:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.card[_ngcontent-%COMP%], .card-header[_ngcontent-%COMP%]{background-color:#f3f1f5}.card[_ngcontent-%COMP%]{margin-top:10%;min-height:670px}.profile-img[_ngcontent-%COMP%]{width:70%;margin-left:15%;position:relative;bottom:40%}.text-header[_ngcontent-%COMP%]{position:absolute;margin-top:20%}.text-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:1.5em}.form-register[_ngcontent-%COMP%]{margin-top:20%;width:100%}.card-body[_ngcontent-%COMP%]{position:absolute;top:5%}.btn-register[_ngcontent-%COMP%]{background-color:#8e7cc3;border-color:#8e7cc3}.btn-register[_ngcontent-%COMP%]:active, .btn-register[_ngcontent-%COMP%]:focus, .btn-register[_ngcontent-%COMP%]:hover, .btn-register[_ngcontent-%COMP%]:link, .btn-register[_ngcontent-%COMP%]:visited{background-color:#f3f1f5;color:#8e7cc3}@media (min-width:1024px){.profile-img[_ngcontent-%COMP%]{width:auto;margin-left:auto}.card[_ngcontent-%COMP%]{margin-top:3%;max-height:660px;min-height:630px}.text-header[_ngcontent-%COMP%]{position:absolute;margin-top:8%}.text-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:2em}.card-body[_ngcontent-%COMP%]{top:0;width:70%}}"]}),c),R=e("+XmF"),y=[{path:"login",canActivate:[R.a],component:M},{path:"register",canActivate:[R.a],component:O},{path:"logout",component:d}],P=((a=function t(){_classCallCheck(this,t)}).\u0275mod=u.Lb({type:a}),a.\u0275inj=u.Kb({factory:function(t){return new(t||a)},imports:[[g.d.forChild(y)],g.d]}),a),_=e("PCNd"),w=((s=function t(){_classCallCheck(this,t)}).\u0275mod=u.Lb({type:s}),s.\u0275inj=u.Kb({factory:function(t){return new(t||s)},providers:[l.a,C],imports:[[P,_.a,b.i]]}),s)}}]);