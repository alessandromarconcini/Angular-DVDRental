import {Apollo, gql, QueryRef} from "apollo-angular";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {LoginService} from "../login/login.service";



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

export interface Film {
  title: string,
  releaseyear: string
  rating: string
  categoryname: string
  language: string
  rentalrate: any
  rentalduration: number
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // Per condividere le info sul film nelle finestre di dialogo
  sharedDataTitle: string = '';
  sharedDataCategory: string = '';
  sharedViewInfoStore: boolean = true;
  sharedInfoStoreOrder: string= "";
  sharedClassValidator = false;
  sharedMaxRentalDuration: number = 0;

  //Query per visualizzare i dati dei film sulle card in homepage
  private filmsQuery: QueryRef<{films: FilmResult}, {offset: number}>;

  //terza query per filtrare le categorie
  private filmCategoryQuery: QueryRef<{film_category_search: FilmResultByCategory}, {categories: any[], offset: number}>;

  //quarta query per filtrare i titoli
  private filmTitleQuery: QueryRef<{film_title_search: FilmResultByTitle}, {title: string, offset: number}>;

  //quinta query per filtrare i titoli
  private filmTitleAndCategoryQuery: QueryRef<{film_title_and_category_search: FilmResultByTitleAndCategory}, {title: string,categories: any[], offset: number}>;

  constructor(private apollo: Apollo,private router:Router,private loginService:LoginService){

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

  }

  async getFilms(offset: number): Promise<FilmResult> {

    if(!await this.loginService.tokenCheck(localStorage.getItem('token'), localStorage.getItem('expirationTime'), localStorage.getItem('generationDate'))){
      this.loginService.redirectPageToLogin()
    }

    const result = await this.filmsQuery.refetch({offset});
    return result.data.films;
  }

  async getFilmsByCategory(categories: [string], offset: number): Promise<FilmResultByCategory> {

    if(!await this.loginService.tokenCheck(localStorage.getItem('token'), localStorage.getItem('expirationTime'), localStorage.getItem('generationDate'))){
      this.loginService.redirectPageToLogin()
    }

    const result = await this.filmCategoryQuery.refetch({categories, offset});
    return result.data.film_category_search;
  }

  async getFilmsByTitle(title: string, offset: number): Promise<FilmResultByTitle> {

    if(!await this.loginService.tokenCheck(localStorage.getItem('token'), localStorage.getItem('expirationTime'), localStorage.getItem('generationDate'))){
      this.loginService.redirectPageToLogin()
    }

    const result = await this.filmTitleQuery.refetch({title, offset});
    return result.data.film_title_search;
  }

  async getFilmsByTitleAndCategory(title: string, categories: [string], offset: number): Promise<FilmResultByTitleAndCategory> {

    if(!await this.loginService.tokenCheck(localStorage.getItem('token'), localStorage.getItem('expirationTime'), localStorage.getItem('generationDate'))){
      this.loginService.redirectPageToLogin()
    }

    const result = await this.filmTitleAndCategoryQuery.refetch({title, categories, offset});
    return result.data.film_title_and_category_search;
  }
}
