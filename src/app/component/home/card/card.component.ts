import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {InfoFilmComponent} from "../info-film/info-film.component";
import {MatDialog} from "@angular/material/dialog";
import {RentDialogComponent} from "../rent-dialog/rent-dialog.component";
import {HomeService,Film} from "../homeService";
import {InfoFilmService} from "../info-film/info-film.service";
import{OrdersService} from "../../orders/orders.service";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})


export class CardComponent implements OnInit, OnChanges{

  constructor(public dialog: MatDialog, private homeService:HomeService,public infoFilmService:InfoFilmService,
              private orderService: OrdersService) {}

  async ngOnInit(): Promise<void> {
    await this.updateFilms();
  }

  //Variabile controllo selezione categoria
  countCategory: any[string] = []
  countFilm: any[string] = []
  flag: boolean = false

  //********** SEZIONE DATI SULLE CARD **********

  films: Film[] = [];
  offset: number = 0;
  count : number = 0;

  //Funzione utile al caricamento iniziale dei film
  async updateFilms(){
    const result = await this.homeService.getFilms(this.offset);
    this.count = result.count;
    this.films = result.films;
  }

  //********** SEZIONE NAVIGAZIONE HOME PAGE **********

  pag1: number = 1;
  pag2: number = 2;
  pag3: number = 3;
  pag4: number = 4;
  pag5: number = 5;

  selectedPage: number = 1

  resetNumberPages(){this.pag1 = 1;this.pag2 = 2; this.pag3 = 3; this.pag4 = 4; this.pag5 = 5;}
  decrementNumberPages(){this.pag1 = this.pag1 -= 1; this.pag2 = this.pag2 -= 1; this.pag3 = this.pag3 -= 1; this.pag4 = this.pag4 -= 1; this.pag5 = this.pag5 -= 1}
  incrementNumberPages(){ this.pag1 = this.pag1 += 1; this.pag2 = this.pag2 += 1; this.pag3 = this.pag3 += 1; this.pag4 = this.pag4 += 1; this.pag5 = this.pag5 += 1;}


  //Funzione utile per navigare nella pagina precedente
  async onPrevious(){


      if (this.selectedPage > 1)
        this.selectedPage -= 1;

      if (this.offset > 0) {

        this.offset -= 12;
        this.decrementNumberPages()

        if (this.pag1 <= 0) {
          this.resetNumberPages()
        }

      }
      await this.refreshPage()

  }

  //Funzione utile per navigare nella pagina successiva
  async onNext(){

      if(this.count >12) {
        if (this.offset <= 1000) {

          this.selectedPage += 1
          this.offset += 12;

          // Calcolo max page ovvero il numero massimo che devo poter cliccare/visualizzare
          let maxPage = this.count / 12

          // Se ho un numero con la virgola, allora ho una pagina con meno di 12 card, devo tenerla
          // Però non devo sommare 1 a qualcosa che si arrotonda per eccesso
          if (maxPage % 2 > 0 && ((maxPage - Math.round(maxPage)) > 0) && ((maxPage - Math.round(maxPage)) < 0.5))
            maxPage = Math.round(maxPage) + 1
          else
            maxPage = Math.round(maxPage)

          // Se il mio insieme di pagine visualizzabili oltrepassa il numero della quinta casella allora arresto l'incremento
          if (maxPage > this.pag5)
            this.incrementNumberPages()
        }

        // controllo card ultima pagina senza selezione di categoria
        if (this.films.length < 12) {

          this.selectedPage -= 1
          this.offset -= 12;
          this.decrementNumberPages();
        }

        // Controllo di non essere sfociato nelle pagine successive all'ultima (NECESSARIO)
        this.maxPageCheck()

        if(this.pag1 < 0)
          this.resetNumberPages()

        if (this.count <= 12)
          this.setTofirstPage()

        // controllo selezione categoria e aggiorna la pagina
        await this.refreshPage()
      }
  }

  //Funzione utile per navigare nelle pagine nella home cambiando le card andando alla pagina desiderata
  async goToPage(page: number){
          this.selectedPage = page;

          if ((this.selectedPage - this.count / 12) < 1) {

            // deve mostrare il range corretto per ogni numero (tra quelli dell'impaginazione) della pagina

            this.offset = (page - 1) * 12;

            if (this.offset <= this.countCategory.length) {
              this.pag1 = page;
              this.pag2 = this.pag1 + 1;
              this.pag3 = this.pag2 + 1;
              this.pag4 = this.pag3 + 1;
              this.pag5 = this.pag4 + 1;
            }

            // evito la pagina O, non ho card quindi torno all'inizio
            // metto in ordine i numeri dell'impaginazione
            this.avoidPageZeroCheck();

          }
          await this.refreshPage()
  }

  async refreshPage() {
    if (this.countCategory.length > 0 && this.titleSelect === undefined ) {
      await this.updateFilmsByCategory(this.countCategory);
    }
    else if (this.countCategory.length == 0 && this.titleSelect !== undefined ) {
      await this.updateFilmsByTitle(this.titleSelect.currentValue);
    }
    else if (this.countCategory.length > 0 && this.titleSelect !== undefined ) {
      await this.updateFilmsByTitleAndCategory(this.titleSelect.currentValue, this.countCategory);
    }
    else {
      await this.updateFilms();
    }
  }

  avoidPageZeroCheck(){
    if(this.pag1 <=0 ) {
      this.offset = 0;
      this.resetNumberPages()
    }
  }

  maxPageCheck(){

    if(this.count > 12) {
      // Calcolo maxpage ovvero il numero massimo che devo poter cliccare/visualizzare
      let maxPage = this.count / 12

      // Se ho un numero con la virgola, allora ho una pagina con meno di 12 card, devo tenerla
      // Però non devo sommare 1 a qualcosa che si arrotonda per eccesso
      if (maxPage % 2 > 0 && ((maxPage - Math.round(maxPage)) > 0) && ((maxPage - Math.round(maxPage)) < 0.5))
        maxPage = Math.round(maxPage) + 1
      else
        maxPage = Math.round(maxPage)

      // Se sono oltre la pagina di card massima devo resettare tutto con le pagine finali a ritroso
      if (maxPage <= this.selectedPage || this.pag5 > maxPage) {

        if(this.selectedPage > this.pag4) {
          this.pag5 = maxPage;
          this.pag4 = this.pag5 - 1
          this.pag3 = this.pag4 - 1
          this.pag2 = this.pag3 - 1
          this.pag1 = this.pag2 - 1

          this.selectedPage = maxPage

          this.offset = (maxPage - 1) * 12
        }
        else{
          this.resetNumberPages()
        }
      }
    }
  }


  //********** SEZIONE RICEZIONI DATI DA COMPONET PARENT PER MODIFICA CARD BY CATEGORY AND TITLE ***************

  //* SEZIONE INFOMRAZIONI FILM FINESTRA DI DIALOGO *

  //Funzione utile all'apertura della finestra di dialogo card
  openDialog(titleToShare: string, categoryToShare:string, maxRentalDuration: number) {
    this.infoFilmService.sharedDataTitle = titleToShare
    this.infoFilmService.sharedDataCategory = categoryToShare
    this.infoFilmService.sharedMaxRentalDuration = maxRentalDuration
    this.infoFilmService.sharedViewInfoStore = true
    this.infoFilmService.sharedClassValidator = false // per stile css
    const dialogRef = this.dialog.open(InfoFilmComponent);
  }

  openDialogRent(titleToShare: string, categoryToShare:string, maxRentalDuration: number) {
    this.infoFilmService.sharedDataTitle = titleToShare
    this.infoFilmService.sharedDataCategory = categoryToShare
    this.infoFilmService.sharedMaxRentalDuration = maxRentalDuration
    this.infoFilmService.sharedViewInfoStore = true
    this.infoFilmService.sharedClassValidator = true

    const dialogRef = this.dialog.open(RentDialogComponent);
  }


  //Variabili di supporto per query
  categorySelect: any
  titleSelect: any
  reset : any

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.resetNumberPages();
    this.offset = 0;
    this.count = 0;
    this.films = [];
    this.selectedPage = 1

    const titleChanged = changes['titleFromHome'];
    const categoryChanged = changes['categoryFromHome'];

    if ((titleChanged && titleChanged.currentValue) || (categoryChanged && categoryChanged.currentValue &&
      categoryChanged.currentValue.length > 0)) {
      if (titleChanged && titleChanged.currentValue) {

        this.titleSelect = titleChanged
        if (this.categorySelect) {
          await this.updateFilmsByTitleAndCategory(titleChanged.currentValue, this.categorySelect.currentValue);
        } else {
          await this.updateFilmsByTitle(titleChanged.currentValue);

        }
      }
      // Se cambia la categoria
      else if (categoryChanged && categoryChanged.currentValue && categoryChanged.currentValue.length > 0) {
        this.countCategory = categoryChanged.currentValue;
        this.categorySelect = categoryChanged
        if(this.titleSelect){
          await this.updateFilmsByTitleAndCategory(this.titleSelect.currentValue, this.countCategory)
        }else {
          await this.updateFilmsByCategory(this.countCategory);
        }
      }
    } else {
      this.categorySelect = this.reset
      this.titleSelect = this.reset
      await this.updateFilms();
    }
  }


  @Input() titleFromHome!: string;
  async updateFilmsByTitle(title: string){

    const result = await this.homeService.getFilmsByTitle(title, this.offset);
    this.count = result.count;
    this.films = result.film_title_search;
  }

  @Input() categoryFromHome!: { [key: string]: any }; //il tipo di dato ricevuto ha chiave di tipo stringa e valore any
  //Questo perché il dato arriva dal component parent tramite l'utilizzo di un evento (selectionChange)

  async updateFilmsByCategory(category: [string]){
    const result = await this.homeService.getFilmsByCategory(category, this.offset);
    this.count = result.count;
    this.films = result.film_category_search;
  }

  async updateFilmsByTitleAndCategory(title: string, category: [string]){

    const result = await this.homeService.getFilmsByTitleAndCategory(title, category, this.offset);
    this.count = result.count;
    this.films = result.film_title_and_category_search;

  }

  resultSearch(numFilm: number){
    return numFilm == null;
  }

  resultSearch2(numFilm: number){
    return numFilm != 0;
  }

   setTofirstPage() {
    this.goToPage(1)
  }

}
