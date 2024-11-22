import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  title = 'Zoológico';

  userName: string = 'Usuario';

  ngOnInit(): void {
    // Obtén el usuario autenticado desde el localStorage
    const currentUser = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.userName = currentUser?.nombre || 'Usuario';
  }
}

