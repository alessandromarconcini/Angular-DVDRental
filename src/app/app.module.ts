import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { CardComponent } from './component/home/card/card.component';
import { LoginComponent } from './component/login/login.component';
import { NewUserComponent } from './component/login/new-user/new-user.component';
import { OrdersComponent} from "./component/orders/orders.component";
import { InfoFilmComponent } from './component/home/info-film/info-film.component';
import { AppRoutingModule } from './app-routing.module';
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from "@angular/router";
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import { FlexLayoutModule } from "@angular/flex-layout";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSortModule} from "@angular/material/sort";
import {ReactiveFormsModule} from "@angular/forms";
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import {HomeComponent} from "./component/home/home.component";
//import {DvdStoreService} from "./dvd-store.service";
import { FormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import {LoginService} from "./component/login/login.service";
import {MatRadioModule} from "@angular/material/radio";
import {NgOptimizedImage} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {RentDialogComponent} from "./component/home/rent-dialog/rent-dialog.component";
import {MatIconModule} from "@angular/material/icon";
import {PopupOrderComponent} from "./component/home/popup-order/popup-order.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    CardComponent,
    LoginComponent,
    NewUserComponent,
    OrdersComponent,
    InfoFilmComponent,
    RentDialogComponent,
    PopupOrderComponent,
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        RouterOutlet,
        RouterLink,
        RouterModule,
        RouterLinkActive,
        MatCardModule,
        MatDialogModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        MatSelectModule,
        FlexLayoutModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatChipsModule,
        ReactiveFormsModule,
        GraphQLModule,
        HttpClientModule,
        AuthModule.forRoot({
            domain: 'dev-mej8ngpb2x4xuodl.us.auth0.com',
            clientId: 'lL0ZSG8RG1sD37SwWPMlxb2Im5NTGXOs',
            // Non serve
            authorizationParams: {
                redirect_uri: 'http://localhost:4200/home'
            }
        }),
        MatRadioModule,
        NgOptimizedImage,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSlideToggleModule,
        MatIconModule,
    ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
