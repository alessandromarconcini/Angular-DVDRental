import {Apollo, gql, QueryRef} from "apollo-angular";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {LoginService} from "../../login/login.service";

export interface StoreResult {
  film_store_information: Store[];
}
export interface Store {
  title: string,
  address: string
  city: string
  phone: string
}

export interface SameDateTest{
  result:boolean
}

@Injectable({
  providedIn: 'root'
})

export class RentDialogService{

  //Query per visualizzare lae informazioni di uno store che possiede una copia del film e i dati d'interesse
  private infoStoreQuery: QueryRef< {film_store_information: StoreResult},{title: string}>;

  //settima query, verifica della data prenotazione
  private dateCheckQuery: QueryRef<{same_date_check: SameDateTest}, {title: string, start_date: string,token:string}>;

  constructor(private apollo: Apollo,private router:Router,private loginService:LoginService) {

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

    this.dateCheckQuery = this.apollo.watchQuery({
      query: gql`query same_date_check ($title:String!, $start_date: String!,$token:String!){
        same_date_check(title: $title, start_date: $start_date,token:$token){
          result
        }
      }
      `
    });
  }

  async getStoreInformation(title: string): Promise<StoreResult> {

    if(!await this.loginService.tokenCheck(localStorage.getItem('token'), localStorage.getItem('expirationTime'), localStorage.getItem('generationDate'))){
      this.loginService.redirectPageToLogin()
    }

    const result = await this.infoStoreQuery.refetch({title});
    return result.data.film_store_information;
  }

  async getSameDateCheck(title: string, start_date: string): Promise<boolean> {

    const token = localStorage.getItem("token")

    let res:any

    if(token != null)
      res = await this.dateCheckQuery.refetch({title, start_date,token});

    return res.data.same_date_check.result
  }
}
