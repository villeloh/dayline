import { ViewController } from 'ionic-angular/navigation/view-controller';
import { LogoutPage } from './../pages/logout/logout';
import { ThumbnailPipe } from './../pipes/thumbnail/thumbnail';
import { ImgModalComponent } from './../components/img-modal/img-modal';
import { ImageBoxComponent } from './../components/image-box/image-box';
import { ImgListPage } from './../pages/img-list/img-list';
import { RegisterPage } from './../pages/register/register';
import { LoginPage } from './../pages/login/login';
import { UserProvider } from './../providers/UserProvider';
import { ImgProvider } from './../providers/ImgProvider';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    ImgListPage,
    LogoutPage,
    ImageBoxComponent,
    ImgModalComponent,
    ThumbnailPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    ImgListPage,
    LogoutPage,
    ImageBoxComponent,
    ImgModalComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ImgProvider,
    UserProvider
  ]
})
export class AppModule {}
