import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ContactService, WEBHOOK_URL } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  const datos = { nombre: 'Ana', apellidos: 'García López', email: 'ana@correo.es', mensaje: 'Hola' };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('envía los datos como JSON por GET al webhook', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);

    await service.send(datos);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(WEBHOOK_URL);
    expect(options.method).toBe('GET');
    expect(JSON.parse(options.body)).toEqual(datos);
  });

  it('lanza un error si el webhook responde con error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(service.send(datos)).rejects.toThrow('500');
  });
});