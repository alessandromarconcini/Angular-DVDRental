import {Component, OnInit} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {MatDialog} from "@angular/material/dialog";
import {FormControl, FormGroup} from "@angular/forms";
import {PopupOrderComponent} from "../popup-order/popup-order.component";
import {RentDialogService, Store} from "./rent-dialog.service";
import {InfoFilmService} from "../info-film/info-film.service";;
import {HomeService} from "../homeService";

@Component({
  selector: 'app-rent-dialog',
  templateUrl: './rent-dialog.component.html',
  styleUrls: ['./rent-dialog.component.css']
})
export class RentDialogComponent implements OnInit{

  titolo : string = "";
  categoria: string = "";
  maxRental: number = 0;
  storeInfo: Store[] = [];
  infoOrder = this.infoFilmService.sharedInfoStoreOrder

  selectedCity: string = "";
  selectedAddress:string = "";
  checkCurrentDate = new Date();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  showInfoStore = this.infoFilmService.sharedViewInfoStore;
  classValidator = this.infoFilmService.sharedClassValidator;

  calendarStatus: { [city: string]: boolean } = {};
  activeToggle: string = '';


  //MUTATION

  rentMutation= gql`
    mutation rent($token:String!,$city:String!,$address:String!,$starting_rental:DateTime!,$end_rental:DateTime!,$film_title:String!) {
      rent(token:$token,city:$city,address:$address,starting_rental:$starting_rental,end_rental: $end_rental,film_title: $film_title) {
        customer_id,
        city,
        address,
        starting_rental,
        end_rental,
        film_title
      }
    }
  `;

  constructor(private infoFilmService:InfoFilmService, private homeService:HomeService,
              private rentDialogService:RentDialogService,private apollo:Apollo, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.titolo = this.infoFilmService.sharedDataTitle;
    this.maxRental = this.infoFilmService.sharedMaxRentalDuration;
    this.updateStoreInformation();
  }


  async updateStoreInformation(){
    const resultStore = await this.rentDialogService.getStoreInformation(this.titolo);
    this.storeInfo = resultStore.film_store_information
  }

  selectCity(city: string) {
    this.selectedCity = city;
  }


  toggleCalendar(city: string, checked: EventTarget | null) {
    if (checked) {
      this.activeToggle = city;
    } else {
      this.activeToggle = '';
    }
    const checkButton = checked as HTMLInputElement
    this.calendarStatus[city] = checkButton.checked;

  }


  validatorRangeDate(){

    if (this.range.value.end && this.range.value.start) {
      const diffInTime: number = this.range.value.end?.getTime() - this.range.value.start?.getTime();
      const diffInDays: number = Math.floor(diffInTime / (1000 * 3600 * 24));

      return diffInDays >= this.maxRental;
    }
    else{
      return false
    }
  }

  ckeckDate(){
    if (this.range.value.start) {
      const diffInTime: number = this.checkCurrentDate.getTime() - this.range.value.start?.getTime();
      const diffInDays: number = Math.floor(diffInTime / (1000 * 3600 * 24));
      return diffInDays > 0;
    }
    else{
      return false
    }
  }

  async rentDVD() {

    let sameDatecheck = false


    if(this.range.value.start !== null)
      sameDatecheck = await this.rentDialogService.getSameDateCheck(this.titolo.toString(),this.parseToServerDate(this.range.value.start))

    //Valori corretti

    if (!this.selectedCity ) {
      console.log("Alert Error Rent DVD NO SELECT CITY")
      alert('Please select a city for DVD pickup before proceeding.\n' +
        'Select Store.');
    }
    else if (this.range.value.start === null || this.range.value.end === null) {
      console.log("Alert Error Rent DVD NO RANGE OF DAY")
      alert('Please select a city date for DVD pickup before proceeding.\n' +
      'Select a range of days.');
    }
    else if (this.ckeckDate()) {
      console.log("Alert Error Rent DVD NO CURRENT DATE")
      alert('Please select start day from current day.');
    }
    else if (this.validatorRangeDate()) {
      console.log("Alert Error Rent DVD MAX RENTAL DURATION")
      alert('Please select a correct day for DVD pickup before proceeding.\n' +
        'Maximum rental duration not respected. You can book the film for a maximum of '+ this.maxRental + ' days.');
    }else if(sameDatecheck){
      console.log("Alert Error Rent SAME DATE")
      alert('You have already pre-ordered this dvd with return date' + this.range.value.start?.toDateString() + '.\n' +
        'The policy of our DVD Store provides for one collection per day for the same DVD.');
    }
    else {

            let token:any
            token = localStorage.getItem("token")

            if(this.range.value.start)
              this.range.value.start.setDate(this.range.value.start.getDate()+1)

            try {
              await this.apollo.mutate({
                mutation: this.rentMutation,
                variables: {
                  token:token,
                  city:this.selectedCity,
                  address:this.selectedAddress,
                  starting_rental:this.range.value.start,
                  end_rental:this.range.value.end,
                  film_title:this.titolo
                }
              }).subscribe()
              console.log('Prenotazione effettuata con successo.');

              const dialogRef = this.dialog.open(PopupOrderComponent);

            } catch (error) {
              console.error('Errore durante la prenotazione', error);
            }

    }
  }

  parseToServerDate(date:Date|undefined){

    //2005-08-02 12:23:43

    let new_date = ""

    if(date !== undefined)
      new_date = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + "22:00:00"


    return new_date
  }

}
