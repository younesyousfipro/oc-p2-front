import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './core/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // task5 - enregistrement de l'intercepteur : sans cette ligne il existe mais
    // n'est jamais appele.
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]

};
