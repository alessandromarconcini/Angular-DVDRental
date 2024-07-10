import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoginService } from '../login/login.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})


export class NavBarComponent {
  showNavbarMenu = false;

  constructor(private router: Router, private loginService: LoginService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbarMenu = false; // Chiude automaticamente il menù a tendina quando si passa a una nuova pagina
      }
    });
  }

  toggleNavbarMenu() {
    this.showNavbarMenu = !this.showNavbarMenu;
  }
  async logout() {

    localStorage.setItem("isLogged","false")

    await this.loginService.removeTokens();
  }




}
