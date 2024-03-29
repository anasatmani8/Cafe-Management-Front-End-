
import { TokenInterceptorInterceptor } from './services/token-interceptor.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {MatCardModule} from '@angular/material/card';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material-module';
import { HomeComponent } from './home/home.component';
import { BestSellerComponent } from './best-seller/best-seller.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';
import { FullComponent } from './layouts/full/full.component';
import { MatButtonModule } from '@angular/material/button';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { SignupComponent } from './signup/signup.component';
import { MatIconModule } from '@angular/material/icon';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { CategoryMenuComponent } from './category-menu/category-menu.component';
import { HighlightDirective } from './directives/highlight.directive';
import { ProduitMenuComponent } from './produit-menu/produit-menu.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { WtspComponent } from './wtsp/wtsp.component';
import { ImageComponent } from './material-component/dialog/image/image.component';
import { ImoAchatComponent } from './imo-achat/imo-achat.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { DragDirective } from './directives/drag.directive';
import { WorkComponent } from './work/work.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BestSellerComponent,
    FullComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    SignupComponent,
    ForgotPasswordComponent,
    LoginComponent,
    CategoryMenuComponent,
    HighlightDirective,
    ProduitMenuComponent,
    AboutusComponent,
    WtspComponent,
    ImageComponent,
    ImoAchatComponent,
    DragDirective,
    WorkComponent

   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    NgxSpinnerModule

  ],
  providers: [HttpClientModule, {provide:HTTP_INTERCEPTORS, useClass:TokenInterceptorInterceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
