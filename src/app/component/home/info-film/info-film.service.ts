import {Apollo, gql, QueryRef} from "apollo-angular";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {LoginService} from "../../login/login.service";


export interface FilmInformation{
  film_information: Film_info[];
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

@Injectable({
  providedIn: 'root'
})
export class InfoFilmService{

  // Per condividere le info sul film nelle finestre di dialogo
  sharedDataTitle: string = '';
  sharedDataCategory: string = '';
  sharedViewInfoStore: boolean = true;
  sharedInfoStoreOrder: string= "";
  sharedClassValidator = false;
  sharedMaxRentalDuration: number = 0;

  //Query per visualizzare la descrizione di un film e i dati d'interesse
  private infoFilmQuery: QueryRef< {film_information: FilmInformation},{title: string}>;
  constructor(private apollo: Apollo,private router:Router,private loginService:LoginService) {

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
  }

  async getFilmsInformation(title: string): Promise<FilmInformation> {

    if(!await this.loginService.tokenCheck(localStorage.getItem('token'),
      localStorage.getItem('expirationTime'), localStorage.getItem('generationDate'))){
      this.loginService.redirectPageToLogin()
    }

    const result = await this.infoFilmQuery.refetch({title});
    return result.data.film_information;
  }
}
