import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {InfoFilmComponent} from "../home/info-film/info-film.component";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {OrdersService} from "./orders.service"
import {Order} from "./orders.service";
import {HomeService} from "../home/homeService";
import {InfoFilmService} from "../home/info-film/info-film.service";

;

export interface OrderData {
  id: string;
  title: string;
  rental_date: Date;
  return_date: string;
  amount: string;
  categoryname: string;
  store:string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements AfterViewInit,OnInit {

  order_information: Order[] = [];

  displayedColumns: string[] = ['id', 'title', 'rental_date', 'return_date', 'amount', 'info'];
  dataSource: MatTableDataSource<OrderData>;

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;



  constructor(public dialog: MatDialog,private router:Router,
              private titlePage: Title,private ordersService:OrdersService,private homeService:HomeService,private infoFilmService:InfoFilmService) {
    this.dataSource = new MatTableDataSource<OrderData>([]);
  }


  ngOnInit() {
    this.titlePage.setTitle('DVD Store | Orders');

    if(localStorage.getItem("isLogged")!== "true")
      this.router.navigate(['/']);
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.updateOrderRow();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: OrderData, filter: string) => {
      return data.title.toLowerCase().includes(filter);
    };

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async updateOrderRow() {
    const customer_id_string = localStorage.getItem("customer_id");
    let customer_id = 0;

    if (customer_id_string !== null)
      customer_id = parseInt(customer_id_string);

    const result_order = await this.ordersService.getOrderInformation();

    this.order_information = result_order.order_information;
    this.dataSource.data = await Promise.all(
      this.order_information.map((order, index) =>
        this.createNewOrderLine(index + 1)
      )
    );
  }

  async createNewOrderLine(id: number): Promise<OrderData> {

    const order = this.order_information[id - 1];
    const amount = order.return_date === null ? 'Pending' : order.amount.toString();
    const date_return = order.return_date === null ? 'Pending' : order.return_date.toString();


    return {
      id: order.rental_id.toString(),
      title: order.title,
      rental_date: order.rental_date,
      return_date: date_return,
      amount: amount,
      categoryname: order.categoryname,
      store: order.address + " , "+ order.city,
    };
  }

  openDialog(titleToShare: string, categoryToShare:string, store:string) {
    this.infoFilmService.sharedDataTitle = titleToShare;
    this.infoFilmService.sharedDataCategory = categoryToShare;
    this.infoFilmService.sharedViewInfoStore = false;
    this.infoFilmService.sharedInfoStoreOrder = store;

    const dialogRef = this.dialog.open(InfoFilmComponent);
  }

}
