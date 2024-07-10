import {HomeService} from "../home/homeService";
import {Apollo, gql, QueryRef} from "apollo-angular";
import {Injectable} from "@angular/core";
import {LoginService} from "../login/login.service";
import {InfoFilmService} from "../home/info-film/info-film.service";


export interface Order {
  rental_id: number
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

@Injectable({
  providedIn: 'root'
})
export class OrdersService{

  // Per condividere le info sul film nelle finestre di dialogo
  sharedViewInfoStore: boolean = true;


  //Query per elenco ordini customer
  private infoOrderQuery: QueryRef< {order_information: OrderList},{token: string}>;
  constructor(private homeService:HomeService,private apollo: Apollo,private loginService:LoginService) {

    this.infoOrderQuery = this.apollo.watchQuery({
      query: gql`query order_information ($token: String!){
        order_information(token: $token){
          order_information{
            rental_id,
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
  }

  async getOrderInformation(): Promise<OrderList> {

    const token = localStorage.getItem('token')

    if(!await this.loginService.tokenCheck(localStorage.getItem('token'), localStorage.getItem('expirationTime'),
      localStorage.getItem('generationDate'))){
      this.loginService.redirectPageToLogin()
    }

    let result:any

    if(token != null)
      result = await this.infoOrderQuery.refetch({token});
    return result.data.order_information;
  }
}


