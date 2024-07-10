import {Apollo, gql, QueryRef} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

export interface Auth{
  isAuthenticated:boolean,
  token:string|null,
  expiresIn:string|null,
  customer_id:number
}

@Injectable()
export class LoginService {

  // QUERY
  private userQueryRef: QueryRef<{signIn: Auth}, {username:string, password:string}>;

  //sesta query, verifica del token col server
  private tokenTestQuery: QueryRef<{tokenTest: boolean}, {token:string,username:string,password:string}>;

  constructor(private apollo: Apollo, private router: Router) {

    this.userQueryRef = this.apollo.watchQuery({query:gql`
        query signIn($username: String!, $password: String!) {
          signIn(username:$username, password: $password) {
            isAuthenticated,
            token,
            expiresIn,
            customer_id,
          }
        }
      `});

    this.tokenTestQuery = this.apollo.watchQuery({
      query: gql`query tokenTest ($token:String!,$username:String!,$password:String!){
        tokenTest (token:$token, username: $username, password:$password){
          result
        }
      }
      `
    });
  }
  async getUserVerification(username:string, password:string): Promise<Auth> {
    const result = await this.userQueryRef.refetch({username,password})
    return result.data.signIn

  }

  async getTokenResult(): Promise<boolean> {

    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    if(token !== null && username !== null && password !== null) {
      const result = await this.tokenTestQuery.refetch({token,username,password});
      return result.data.tokenTest
    }

    return  false
  }

  removeTokens() {
    localStorage.setItem('token',"");
    console.log('Token removed from localStorage');
  }

  // Funzione di controllo sul token che viene invocata ad ogni richiesta verso il server
  async tokenCheck(token:string|null,expirationTime:string|null,generationDate:string|null){

    if(token === null || expirationTime === null || generationDate === null) {

      token = ""
      expirationTime = ""
      generationDate = ""
      localStorage.setItem('isLogged',"false")

      return false
    }

    let genDateMillis = parseInt(generationDate)

    // Inizializzo di quanto avanzo dalla mia ora
    let howManyHour:number = 0
    let howManyMinutes:number = 0

    // Splitto per leggere i valori

    let hStringList:string[]=[]
    let mStringList:string[]=[]
    let mString:string=expirationTime

    // ESEMPIO: "10h oppure 15m"

    if(expirationTime.includes("h")) {

      hStringList = expirationTime.split('h') // [10][15m]
      howManyHour = parseInt(hStringList[0]) // "10" --> 10
      mString = hStringList[1]
    }

    if(expirationTime.includes("m")) {
      mStringList = mString.split('m') // [15][] perchè splitto ulteriormente solo la casella di destra
      howManyMinutes = parseInt(mStringList[0]) // "15" --> 15
    }

    localStorage.setItem('expirationDate',"0h")

    const currentDate = new Date()
    // Aggiungo alla generation date la finestra temporale scelta dalle opzioni del server

    genDateMillis = genDateMillis +  (howManyHour * 3600 * 1000)
    genDateMillis = genDateMillis + (howManyMinutes * 60 * 1000)

    // geTime restituisce i milliseconds che sono calcolabili
    // Se la data è scaduta annullo il token
    if(currentDate.getTime() > genDateMillis ){

      localStorage.setItem('token',"")
      localStorage.setItem('generationDate',"")
      localStorage.setItem('isLogged',"false")

      return false
    }

    //Dopo aver controllato la data controllo che il token sia lo stesso che è stato memorizzato dal server
    return await this.getTokenResult();
  }

  redirectPageToLogin(){  this.router.navigate(['/login']);  }

}
