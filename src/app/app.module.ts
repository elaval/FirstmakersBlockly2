import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BlocklyModule } from './blockly/blockly.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatCardModule,
  MatSlideToggleModule,
  MatInputModule,
  MatDialogModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BoardAgentModule } from './board-agent/board-agent.module';
import { LocalIpService } from './services/local-ip.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SettingsComponent } from './settings/settings.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
  ],

  entryComponents: [
    SettingsComponent
  ],

  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatCardModule,
    MatSlideToggleModule,
    MatInputModule,
    MatDialogModule,
    FlexLayoutModule,
    BoardAgentModule,
    BlocklyModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
  providers: [
    LocalIpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
