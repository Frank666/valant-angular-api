import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoggingService } from './logging/logging.service';
import { StuffService } from './stuff/stuff.service';
import { environment } from '../environments/environment';
import { ValantDemoApiClient } from './api-client/api-client';
import { MazeListComponent } from './components/maze-list/maze-list.component';
import { MazeUploadComponent } from './components/maze-upload/maze-upload.component';
import { MazeNavigatorComponent } from './components/maze-navigator/maze-navigator.component';
import { MazeService } from './services/MazeService';

export function getBaseUrl(): string {
  return environment.baseUrl;
}

@NgModule({
  declarations: [AppComponent, MazeListComponent, MazeUploadComponent, MazeNavigatorComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [
    LoggingService,
    StuffService,
    ValantDemoApiClient.Client,
    MazeService,
    { provide: ValantDemoApiClient.API_BASE_URL, useFactory: getBaseUrl },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
