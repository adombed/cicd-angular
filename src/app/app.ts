import { Component } from '@angular/core';
import { ContactForm } from './contact-form/contact-form';

@Component({
  selector: 'app-root',
  imports: [ContactForm],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'Formulario de contacto v2';
  fallo: number = No hay ningun valor que añadir para el fallo
}