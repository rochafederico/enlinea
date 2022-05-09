import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ArtistService } from '../../services/artist.service';
import { LiveService } from '../../services/live.service';
import { TrackService } from '../../services/track.service';
import { APIInterceptor } from '../../providers/api.interceptor';
import { EnlineaServicesConfig } from './enlinea-services.config';

@NgModule()
export class EnlineaServicesModule {
  public static forRoot(options?: EnlineaServicesConfig): ModuleWithProviders<EnlineaServicesModule> {
    return {
      declarations: [],
      imports: [
        CommonModule
      ],
      exports: [
        ArtistService,
        LiveService,
        TrackService
      ],
      ngModule: EnlineaServicesModule,
      providers: [
        ArtistService,
        LiveService,
        TrackService,
        {
          provide: APIInterceptor,
          useFactory: () => {
            const result = new APIInterceptor();
            result.UrlBase = options?.UrlBase;
            return result;
          }
        }, {
          provide: HTTP_INTERCEPTORS,
          useClass: APIInterceptor,
          multi: true,
        }
      ]
    } as ModuleWithProviders<EnlineaServicesModule>;
  }
}
