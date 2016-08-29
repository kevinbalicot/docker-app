import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { App } from './components/app';
import { Configuration } from './services/config';
import { DockerRepository } from './services/docker-repository';
import { GitRepository } from './services/git-repository';

bootstrap(App, [Configuration, DockerRepository, GitRepository, HTTP_PROVIDERS]);
