import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],  // Declare components here
  imports: [BrowserModule],      // Import modules here (not components)
  bootstrap: [AppComponent]      // Bootstrap the root component
})
export class AppModule { }