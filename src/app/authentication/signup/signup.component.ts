import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  constructor(@Inject(DOCUMENT) private document: Document,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
    this.document.body.classList.add('bg-gradient-primary');
  }

  onRegister(form: any): void {
    this.authenticationService.register(form.value).subscribe(
      (res) => {
        console.log('Registro exitoso:', res); // Útil para verificar la respuesta
        this.router.navigate(['/login']); // Redirige al login después de registrarse
      },
      (err) => {
        console.error('Error durante el registro:', err); // Maneja errores si es necesario
      }
    );
  }
  
}
