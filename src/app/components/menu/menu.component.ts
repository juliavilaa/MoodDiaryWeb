import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../services/authentication.service'; // Asegúrate de que esta ruta es correcta

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  userName: string = 'Usuario';

  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.userName = currentUser?.nombre || 'Usuario';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Navega a la página de login después de cerrar sesión
  }
}
