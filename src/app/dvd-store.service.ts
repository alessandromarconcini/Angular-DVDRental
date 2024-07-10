/*import {Injectable} from '@angular/core';
import {Apollo, gql, QueryRef} from 'apollo-angular';
import {Router} from "@angular/router";

export interface Film {
  title: string,
  releaseyear: string
  rating: string
  categoryname: string
  language: string
  rentalrate: any
  rentalduration: number
}

export interface Store {
  title: string,
  address: string
  city: string
  phone: string
}

export interface Order {
  title: string,
  rental_date: Date,
  return_date: Date,
  amount: number,
  categoryname: string,
  address:string,
  city:string,
}

export interface OrderList {
  order_information: Order[]
}

export interface FilmResult {
  count: number;
  films: Film[];
}


export interface FilmResultByCategory {
  count: number;
  film_category_search: Film[];
}

export interface FilmResultByTitle {
  count: number;
  film_title_search: Film[];
}

export interface FilmResultByTitleAndCategory {
  count: number;
  film_title_and_category_search: Film[];
}

export interface Film_info{
  rating: string
  releaseyear: number
  rentalduration: number
  rentalrate: number
  title: string
  description: string
  categoryname: string
  language: string
  actorfirstname: string
  actorlastname: string
  length: number
}

export interface FilmInformation{
  film_information: Film_info[];
}
export interface StoreResult {
  film_store_information: Store[];
}

export interface SameDateTest{
  result:boolean
}

@Injectable({
  providedIn: 'root'
})

export class DvdStoreService {
  // Per condividere le info sul film nelle finestre di dialogo
  sharedDataTitle: string = '';
  sharedDataCategory: string = '';
  sharedViewInfoStore: boolean = true;
  sharedInfoStoreOrder: string= "";
  sharedClassValidator = false;
  sharedMaxRentalDuration: number = 0;


  //Query per visualizzare i dati dei film sulle card in homepage
  private filmsQuery: QueryRef<{films: FilmResult}, {offset: number}>;

  //Query per visualizzare la descrizione di un film e i dati d'interesse
  private infoFilmQuery: QueryRef< {film_information: FilmInformation},{title: string}>;

  //Query per visualizzare lae informazioni di uno store che possiede una copia del film e i dati d'interesse
  private infoStoreQuery: QueryRef< {film_store_information: StoreResult},{title: string}>;

  //Query per elenco ordini customer
  private infoOrderQuery: QueryRef< {order_information: OrderList},{token: string}>;

  //terza query per filtrare le categorie
  private filmCategoryQuery: QueryRef<{film_category_search: FilmResultByCategory}, {categories: any[], offset: number}>;


  //quarta query per filtrare i titoli
  private filmTitleQuery: QueryRef<{film_title_search: FilmResultByTitle}, {title: string, offset: number}>;

  //quinta query per filtrare i titoli
  private filmTitleAndCategoryQuery: QueryRef<{film_title_and_category_search: FilmResultByTitleAndCategory}, {title: string,categories: any[], offset: number}>;

  //sesta query, verifica del token col server
  private tokenTestQuery: QueryRef<{tokenTest: boolean}, {token:string,username:string,password:string}>;

  //settima query, verifica della data prenotazione
  private dateCheckQuery: QueryRef<{same_date_check: SameDateTest}, {title: string, start_date: string,token:string}>;

  constructor(private apollo: Apollo,private router:Router) {
    this.filmsQuery = this.apollo.watchQuery({
      query: gql`query films ($offset: Int!){
        films (offset: $offset){
          count
          films {
            title
            releaseyear
            rating
            categoryname
            language
            rentalrate
            rentalduration
          }
        }
      }`
    });

    this.infoFilmQuery = this.apollo.watchQuery({
      query: gql`query film_information ($title: String!){
        film_information(title : $title){
          film_information{
            title,
            rentalrate,
            actorlastname,
            description,
            rating,
            releaseyear,
            rentalduration,
            categoryname,
            language,
            actorfirstname,
            length
          }
        }
      }`
    });

    this.infoStoreQuery = this.apollo.watchQuery({
      query: gql`query film_store_information ($title: String!){
        film_store_information(title : $title){
          film_store_information{
            title,
            address,
            city,
            phone
          }
        }
      }`
    });

    this.infoOrderQuery = this.apollo.watchQuery({
      query: gql`query order_information ($token: String!){
        order_information(token: $token){
          order_information{
            title,
            rental_date,
            return_date,
            amount,
            categoryname,
            address,
            city,
          }
        }
      }`
    });

    this.filmCategoryQuery = this.apollo.watchQuery({
      query: gql`query film_category_search ($categories: [String]!, $offset: Int!){
        film_category_search (categories: $categories, offset: $offset){
          count
          film_category_search {
            title
            releaseyear
            rating
            categoryname
            language
            rentalrate
            rentalduration
          }
        }
      }`
    });

    this.filmTitleQuery = this.apollo.watchQuery({
      query: gql`query film_title_search ($title: String!, $offset: Int!){
        film_title_search (title: $title, offset: $offset){
          count
          film_title_search {
            title
            releaseyear
            rating
            categoryname
            language
            rentalrate
            rentalduration
          }
        }
      }`
    });

    this.filmTitleAndCategoryQuery = this.apollo.watchQuery({
      query: gql`query film_title_and_category_search ($title: String!, $categories: [String]!, $offset: Int!){
        film_title_and_category_search (title: $title, categories: $categories, offset: $offset){
          count
          film_title_and_category_search {
            title
            releaseyear
            rating
            categoryname
            language
            rentalrate
            rentalduration
          }
        }
      }`
    });

    this.tokenTestQuery = this.apollo.watchQuery({
      query: gql`query tokenTest ($token:String!,$username:String!,$password:String!){
        tokenTest (token:$token, username: $username, password:$password){
          result
        }
      }
      `
    });

    this.dateCheckQuery = this.apollo.watchQuery({
      query: gql`query same_date_check ($title:String!, $start_date: String!,$token:String!){
        same_date_check(title: $title, start_date: $start_date,token:$token){
          result
        }
      }
      `
    });
  }

  async getFilms(offset: number): Promise<FilmResult> {

    if(!await this.tokenCheck(localStorage.getItem('token'), localStorage.getItem('expirationTime'), localStorage.getItem('generationDate'))){
      this.redirectPageToLogin()
    }

    const result = await this.filmsQuery.refetch({offset});
    return result.data.films;
  }

  async getFilmsInformation(title: string): Promise<FilmInformation> {

    if(!await this.tokenCheck(localStorage.getItem('token'), localStorage.getItem('expirationTime'), localStorage.getItem('generationDate'))){
      this.redirectPageToLogin()
    }

    const result = await this.infoFilmQuery.refetch({title});
    return result.data.film_information;
  }

  async getStoreInformation(title: string): Promise<StoreResult> {

    if(!await this.tokenCheck(localStorage.getItem('token'), localStorage.getItem('expirationTime'), localStorage.getItem('generationDate'))){
      this.redirectPageToLogin()
    }

    const result = await this.infoStoreQuery.refetch({title});
    return result.data.film_store_information;
  }

  async getOrderInformation(): Promise<OrderList> {

    const token = localStorage.getItem('token')

    if(!await this.tokenCheck(localStorage.getItem('token'), localStorage.getItem('expirationTime'), localStorage.getItem('generationDate'))){
      this.redirectPageToLogin()
    }

    let result:any

    if(token != null)
      result = await this.infoOrderQuery.refetch({token});

    return result.data.order_information;
  }

  async getFilmsByCategory(categories: [string], offset: number): Promise<FilmResultByCategory> {

    if(!await this.tokenCheck(localStorage.getItem('token'), localStorage.getItem('expirationTime'), localStorage.getItem('generationDate'))){
      this.redirectPageToLogin()
    }

    const result = await this.filmCategoryQuery.refetch({categories, offset});
    return result.data.film_category_search;
  }

  async getFilmsByTitle(title: string, offset: number): Promise<FilmResultByTitle> {

    if(!await this.tokenCheck(localStorage.getItem('token'), localStorage.getItem('expirationTime'), localStorage.getItem('generationDate'))){
      this.redirectPageToLogin()
    }

    const result = await this.filmTitleQuery.refetch({title, offset});
    return result.data.film_title_search;
  }

  async getFilmsByTitleAndCategory(title: string, categories: [string], offset: number): Promise<FilmResultByTitleAndCategory> {

    if(!await this.tokenCheck(localStorage.getItem('token'), localStorage.getItem('expirationTime'), localStorage.getItem('generationDate'))){
      this.redirectPageToLogin()
    }

    const result = await this.filmTitleAndCategoryQuery.refetch({title, categories, offset});
    return result.data.film_title_and_category_search;
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

  async getSameDateCheck(title: string, start_date: string): Promise<boolean> {

    const token = localStorage.getItem("token")

    let res:any

    if(token != null)
    res = await this.dateCheckQuery.refetch({title, start_date,token});

    return res.data.same_date_check.result
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

}*/

