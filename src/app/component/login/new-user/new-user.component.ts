import {Component, OnInit} from '@angular/core';
import {NewUserService} from "./new-user.service";
import { SHA3 } from 'crypto-js';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
  providers:[NewUserService]
})
export class NewUserComponent implements OnInit{

  username:string=""
  password:string=""
  confirmPassword:string=""
  errorString:string=""
  showErrorMessage:boolean = false
  alreadySigned = false

  //TEST PASSWORD
  //Albanella$886$

  constructor(private newUserService: NewUserService, private dialogRef: MatDialogRef<NewUserComponent>) { }

  async onSubmit(){

    const double = await this.newUserService.isDoubleUser(this.username)

    if(!this.moreThanEleventCharCheck()) {
      this.errorString = "The password is too short!"
      this.showErrorMessage = true
    }

    else if(!this.hasSpecialCharCheck()) {
      this.errorString = "The password does not contain any special characters!"
      this.showErrorMessage = true
    }

    else if(!this.hasUpperCaseLetterCheck()) {
      this.errorString = "The password does not contain capital letters!"
      this.showErrorMessage = true
    }

    else if(!this.haveLettersCheck()) {
      this.errorString = "The password does not contain any letters!"
      this.showErrorMessage = true
    }

    else if(!this.haveNumberCheck()) {
      this.errorString = "The password does not contain numbers!"
      this.showErrorMessage = true
    }

    else if(!this.confirmPasswordCheck()) {
      this.errorString = "Wrong confirmation password!"
      this.showErrorMessage = true
    }

    else if(this.alreadySigned){
      this.errorString = "Already registered user"
      this.showErrorMessage = true
    }

    else if(double.result){
      this.errorString = "Username already used"
      this.showErrorMessage = true
    }

    else {
      // Se tutto va bene invio
      this.signUp()
      this.showErrorMessage = false
      this.errorString = ""
      this.alreadySigned = true

      this.dialogRef.close()
    }
  }

  ngOnInit(): void {}

  // METODI DI CONTROLLO

  moreThanEleventCharCheck(){ return this.password.length >= 11  }
  hasSpecialCharCheck(){

    const specialCharacters = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    return specialCharacters.test(this.password)
  }
  hasUpperCaseLetterCheck(){

    for (let i = 0; i < this.password.length; i++) {

      if(this.password.charAt(i) >= 'A' && this.password.charAt(i) <= 'Z')
        return true
    }

    return false
  }
  haveLettersCheck(){
    for (let i = 0; i < this.password.length; i++) {

      if((this.password.charAt(i) >= 'a' && this.password.charAt(i) <= 'z') || (this.password.charAt(i) >= 'A' && this.password.charAt(i) <= 'Z'))
        return true
    }

    return false
  }
  haveNumberCheck(){

    const numbers = /[0123456789]/;
    return numbers.test(this.password)
  }

  confirmPasswordCheck(){ return this.password === this.confirmPassword }

  //Comunicazione col server
  signUp(){

    //Hashing password
    const passwordHash: string = SHA3(this.password, { outputLength: 256 }).toString();

    try {
      this.newUserService.signUp(this.username, passwordHash)
    }
    catch (err){
      console.error(err)
    }

  }
}
