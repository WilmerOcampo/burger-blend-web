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

const firebaseConfig = {
  apiKey: '${API_KEY}',
  authDomain: '${AUTH_DOMAIN}',
  databaseURL: '${DATABASE_URL}',
  projectId: '${PROJECT_ID}',
  storageBucket: '${STORAGE_BUCKET}',
  messagingSenderId: '${MESSAGING_SENDER_ID}',
  appId: '${APP_ID}'
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
    importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig)),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireModule,
  ],
})
export class AppModule {
}
