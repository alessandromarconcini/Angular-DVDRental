import {Component, OnInit,} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent  implements OnInit{


  selectCategory = new FormControl();
  categoryToShare : string[] = [];

  searchTitle: string = "";
  resetTitle: string = "";
  searchTitleToShare: string = "";

  selectOpened = false;



  handleSelectOpen(event: any) {
    this.selectOpened = event;
  }

  public constructor(private router:Router, private titlePage: Title) {}

  clickSelectCategory() {
    this.categoryToShare = this.selectCategory.value;
    if(this.categoryToShare.length == 0){
      this.searchTitle = this.resetTitle
    }
  }

  submitSearch() {
    this.searchTitleToShare = this.searchTitle;
    if(this.searchTitleToShare.length == 0){
      this.selectCategory = new FormControl()
    }
  }
  ngOnInit() {
    this.titlePage.setTitle('DVD Store | Home');

    if(localStorage.getItem("isLogged")!== "true")
      this.router.navigate(['/']);

  }

  toppingList: string[] = ["Action", "Animation", "Children" ,"Classics" ,"Comedy" ,"Documentary" ,"Drama" ,"Family" ,
    "Foreign", "Games", "Horror", "Music", "New", "Sci-Fi", "Sports", "Travel"];

}


