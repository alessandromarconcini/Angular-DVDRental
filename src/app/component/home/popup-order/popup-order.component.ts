import {Component, OnInit} from '@angular/core';



@Component({
  selector: 'app-popup-order',
  templateUrl: './popup-order.component.html',
  styleUrls: ['./popup-order.component.css']
})
export class PopupOrderComponent implements OnInit{



    openPopup() {
      let popup = document.getElementById("popup")
      if(popup != null)
        popup.classList.add("open-popup");

    }

    closePopup() {
      let popup = document.getElementById("popup")
      if(popup != null)
        popup.classList.remove("open-popup");
    }

    ngOnInit() {
      this.openPopup();
    }

}
