import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component'; // Import the standalone component

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppComponent  // Import the standalone component directly
  ],
  providers: [],
  bootstrap: [AppComponent]  // Bootstrap AppComponent as the main component
})
export class AppModule { }

