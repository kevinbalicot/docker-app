'use strict';

import { Component } from '@angular/core';
import { Configuration } from './../services/config';
import { DockerRepository } from './../services/docker-repository';

@Component({
    selector: 'docker-app-configuration-component',
    template: `
    <div class="alert alert-danger" *ngIf="!!error">
        <p>{{ error }}</p>
    </div>
    <div class="alert alert-success" *ngIf="!!success">
        <p>{{ success }}</p>
    </div>
    <form (submit)="submit($event)">
        <div class="form-group">
            <label for="url">Server url</label>
            <input type="text" id="url" class="form-control" required="required" [(ngModel)]="url" placeholder="http://" />
        </div>
        <div class="form-group">
            <label for="port">Server port</label>
            <input type="text" id="port" class="form-control" required="required" [(ngModel)]="port" />
        </div>
        <button type="submit" class="btn btn-success" [disabled]="!validate()" [disabled]="loading">
            Ok <i *ngIf="loading" class="fa fa-pulse fa-spinner"></i>
        </button>
    </form>
    `
})
export class Config {

    constructor (config: Configuration, repository: DockerRepository) {
        this.config = config;
        this.repository = repository;
        this.error = null;
        this.success = null;

        this.url = this.config.get('config-url');
        this.port = this.config.get('config-port');
        this.loading = false;
    }

    submit (event) {
        event.preventDefault();

        this.loading = true;
        this.error = null;
        this.success = null;
        this.config.set('config-url', this.url);
        this.config.set('config-port', this.port);
        this.config.set('config-validated', false);

        this.repository.ping().subscribe(result => {
            if (result.message === 'ok') {
                this.config.set('config-url', this.url);
                this.config.set('config-port', this.port);
                this.config.set('config-validated', true);
            }
            this.success = 'Every thing it\'s ok :)';
            this.loading = false;
        }, error => {
            this.error = `Can't ping server with url ${this.url}:${this.port}`;
            this.loading = false;
        });
    }

    validate () {
        return !!this.url && !!this.port;
    }
}
