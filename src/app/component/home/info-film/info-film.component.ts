import {Component, OnInit} from '@angular/core';
import {Film_info, InfoFilmService} from "./info-film.service";
import {HomeService} from "../homeService";



@Component({
  selector: 'app-info-film',
  templateUrl: './info-film.component.html',
  styleUrls: ['./info-film.component.css']
})


export class InfoFilmComponent implements OnInit{

  titolo : string = "";
  categoria:string = "";
  film_information : Film_info[] = [];

  constructor(private infoFilmService:InfoFilmService) {}


  ngOnInit(): void {
    this.titolo = this.infoFilmService.sharedDataTitle;
    this.categoria = this.infoFilmService.sharedDataCategory;
    this.updateFilmsInformation();
  }



  async updateFilmsInformation(){
    const result = await this.infoFilmService.getFilmsInformation(this.titolo);

    const filteredResultByCategory: Film_info[] = [];

    for (let i = 0; i<result.film_information.length; i++){

      if(result.film_information[i].categoryname == this.categoria)
        filteredResultByCategory.push(result.film_information[i])
    }

    this.film_information = filteredResultByCategory

  }


}

