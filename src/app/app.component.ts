import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'webzoologico';
  titlePage = '';

  constructor(@Inject(DOCUMENT) private document: Document, private router:Router){

  }
  ngOnInit(): void {
    //this.document.body.classList.add('bg-gradient-primary');
  }
  esPaginaLogin(): boolean {
    return this.router.url === '/login'; // Cambia '/login' si el path es diferente
  }
}
