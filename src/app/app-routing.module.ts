import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './authentication/signup/signup.component';
import { LoginComponent } from './authentication/login/login.component';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { EmocionComponent } from './components/emocion/emocion.component';
import { AnalisisComponent } from './components/analisis/analisis.component';
import { MetaComponent } from './components/meta/meta.component';
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
  {path: '',component: SignupComponent},
  {path: 'signup',component: SignupComponent},
  {path: 'login',component: LoginComponent},
  {path: 'logout',component: AppComponent},
  {path: 'menu',component: MenuComponent},
  {path: 'home', component: HomeComponent },
  {path: 'analisis', component: AnalisisComponent },
  {path: 'emociones', component: EmocionComponent },
  {path: 'metas', component: MetaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
