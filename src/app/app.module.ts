import {importProvidersFrom, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

// icons
import {TablerIconsModule} from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

//Import all material modules
import {MaterialModule} from './material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgScrollbarModule} from 'ngx-scrollbar';

import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {fbConfig} from "./fb-config";

const firebaseConfig = {
  /*apiKey: process.env['API_KEY'] as string,
  authDomain: process.env['AUTH_DOMAIN'] as string,
  databaseURL: process.env['DATABASE_URL'],
  projectId: process.env['PROJECT_ID'] as string,
  storageBucket: process.env['STORAGE_BUCKET'] as string,
  messagingSenderId: process.env['MESSAGING_SENDER_ID'] as string,
  appId: process.env['APP_ID'] as string*/
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TablerIconsModule.pick(TablerIcons),
    NgScrollbarModule,
  ],
  exports: [TablerIconsModule],
  bootstrap: [AppComponent],
  providers: [
    importProvidersFrom(AngularFireModule.initializeApp(fbConfig)),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireModule,
  ],
})
export class AppModule {
}
