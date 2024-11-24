import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(@Inject(DOCUMENT) private document: Document,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
    this.document.body.classList.add('bg-gradient-primary');
  }

  onLogin(form: any): void {
    this.authenticationService.login(form.value).subscribe(
      (res:any) => {
        localStorage.setItem('access-token',JSON.parse(JSON.stringify(res)).token);
        localStorage.setItem('usuario', JSON.stringify(res.user));
        this.router.navigateByUrl('/home');
      }
    );
  }
}
