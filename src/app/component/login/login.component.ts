import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {NewUserComponent} from "./new-user/new-user.component";
import { AuthService } from '@auth0/auth0-angular';
import {LoginService} from "./login.service";
import {SHA3} from "crypto-js";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})


export class LoginComponent implements OnInit {

  username: string = ""
  password: string = ""
  showErrorMessage: boolean = false
  errorString: string = ""

  constructor(public dialog: MatDialog, public auth: AuthService, public loginService: LoginService,private router:Router, private titlePage: Title) {
  }

  openDialog() {
    this.dialog.open(NewUserComponent);
  }

  async onSubmit() {

    try {
      const isAuthenticated = await this.getUserVerification();

      if (isAuthenticated) {
        this.router.navigate(['/home']);
        localStorage.setItem('isLogged', 'true');
      }
    } catch (error) {
      this.showErrorMessage = true;
      this.errorString = 'Wrong Username or Password';
      console.log(this.errorString);
    }
  }


  ngOnInit(): void {
    this.titlePage.setTitle('DVD Store | Login');

    if (localStorage.getItem('isLogged') === "true")
      window.location.href = 'http://localhost:4200/home'
  }

  async getUserVerification(): Promise<boolean> {
    const passwordHash: string = SHA3(this.password, {
      outputLength: 256,
    }).toString();

    localStorage.setItem('password', passwordHash);
    localStorage.setItem('username', this.username);

    const authenticationResult = await this.loginService.getUserVerification(
      this.username,
      passwordHash
    );

    if (authenticationResult.isAuthenticated) {
      if (authenticationResult.customer_id !== null) {
        localStorage.setItem(
          'customer_id',
          authenticationResult.customer_id.toString()
        );
      } else {
        throw new Error('Customer ID is null');
      }

      const token = authenticationResult.token ?? '';
      const expiresIn = authenticationResult.expiresIn ?? '';

      localStorage.setItem('token', token);
      localStorage.setItem('expirationTime', expiresIn);
      localStorage.setItem('generationDate', new Date().getTime().toString());

      return true;
    } else {
      return false;
    }
  }
}

