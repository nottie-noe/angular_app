import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule],
  template: `
    <div style="text-align:center; font-family: 'Arial', sans-serif; color: blue;">
      <h1>Hello World, I'm Nothando Ndlovu, a Devops Engineer</h1>
      <h3>This Angular app is deployed with Jenkins, Ansible, and Apache!</h3>
    </div>
  `
})
export class AppComponent {}

