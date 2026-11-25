import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../contact.service';

type Status = 'idle' | 'sending' | 'success' | 'error';
type Campo = 'nombre' | 'apellidos' | 'email' | 'mensaje';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);

  status = signal<Status>('idle');

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mensaje: ['', Validators.required],
  });

  invalid(campo: Campo): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.status.set('sending');
    try {
      await this.contactService.send(this.form.getRawValue());
      this.status.set('success');
      this.form.reset();
    } catch {
      this.status.set('error');
    }
  }

  onClear(): void {
    this.form.reset();
    this.status.set('idle');
  }
}