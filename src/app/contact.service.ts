import { Injectable } from '@angular/core';

export interface ContactData {
  nombre: string;
  apellidos: string;
  email: string;
  mensaje: string;
}

export const WEBHOOK_URL = 'https://hook.eu1.make.com/PEGA_AQUI_TU_URL';

@Injectable({ providedIn: 'root' })
export class ContactService {
  async send(data: ContactData): Promise<void> {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
  }
}