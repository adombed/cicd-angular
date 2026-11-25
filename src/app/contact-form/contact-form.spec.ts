import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ContactService } from '../contact.service';
import { ContactForm } from './contact-form';

describe('ContactForm', () => {
  let fixture: ComponentFixture<ContactForm>;
  let component: ContactForm;
  let el: HTMLElement;
  let enviar: ReturnType<typeof vi.fn>;

  const datos = { nombre: 'Ana', apellidos: 'García', email: 'ana@correo.es', mensaje: 'Hola' };
  const enviarFormulario = () =>
    el.querySelector('form')!.dispatchEvent(new Event('submit'));

  beforeEach(async () => {
    enviar = vi.fn().mockResolvedValue(undefined);
    await TestBed.configureTestingModule({
      imports: [ContactForm],
      providers: [{ provide: ContactService, useValue: { send: enviar } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('el formulario está inválido cuando está vacío', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('valida el formato del correo electrónico', () => {
    component.form.controls.email.setValue('no-es-un-email');
    expect(component.form.controls.email.hasError('email')).toBe(true);
    component.form.controls.email.setValue('ana@correo.es');
    expect(component.form.controls.email.valid).toBe(true);
  });

  it('actualiza el formulario al escribir en un input', () => {
    const input = el.querySelector('#nombre') as HTMLInputElement;
    input.value = 'Luis';
    input.dispatchEvent(new Event('input'));
    expect(component.form.controls.nombre.value).toBe('Luis');
  });

  it('no envía si es inválido y muestra los errores', () => {
    enviarFormulario();
    fixture.detectChanges();
    expect(enviar).not.toHaveBeenCalled();
    expect(el.querySelectorAll('.error').length).toBe(4);
  });

  it('envía los datos y muestra el mensaje de éxito', async () => {
    component.form.setValue(datos);
    enviarFormulario();
    await vi.waitFor(() => expect(component.status()).toBe('success'));
    fixture.detectChanges();

    expect(enviar).toHaveBeenCalledWith(datos);
    expect(el.querySelector('.alert.success')).not.toBeNull();
    expect(component.form.getRawValue().nombre).toBe('');
  });

  it('muestra un mensaje de error si falla el envío', async () => {
    enviar.mockRejectedValue(new Error('fallo'));
    component.form.setValue(datos);
    enviarFormulario();
    await vi.waitFor(() => expect(component.status()).toBe('error'));
    fixture.detectChanges();

    expect(el.querySelector('.alert.fail')).not.toBeNull();
  });

  it('el botón Limpiar borra todos los datos', () => {
    component.form.setValue(datos);
    (el.querySelector('button[type="button"]') as HTMLButtonElement).click();
    expect(component.form.getRawValue()).toEqual({ nombre: '', apellidos: '', email: '', mensaje: '' });
    expect(component.status()).toBe('idle');
  });
});