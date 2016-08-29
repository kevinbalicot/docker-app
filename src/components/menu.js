'use strict';

import { Component } from '@angular/core';
import { Configuration } from './../services/config';
import { DockerRepository } from './../services/docker-repository';

@Component({
    selector: 'docker-app-menu',
    template: `
    <nav class="navbar navbar-inverse">
        <div class="container">
            <div class="navbar-header">
                <a class="navbar-brand" href="#">Docker API</a>
            </div>

            <div class="collapse navbar-collapse">
                <p class="navbar-text">
                    Configuration
                    <span class="label label-danger" *ngIf="!checkConfig()">Error</span>
                    <span class="label label-success" *ngIf="checkConfig()">Ok</span>
                </p>
                <p class="navbar-text">
                    Server up
                    <i class="fa fa-refresh fa-pulse" *ngIf="loading"></i>
                    <span class="label label-danger" *ngIf="!connected">Error</span>
                    <span class="label label-success" *ngIf="connected">Ok</span>
                </p>
            </div>
        </div>
    </nav>
    `
})
export class Menu {

    constructor (config: Configuration, repository: DockerRepository) {
        this.config = config;
        this.repository = repository;
        this.loading = false;
        this.connected = false;

        this.serverUp();
        setInterval(() => {
            this.serverUp();
        }, 1000 * 60 * 10);
    }

    checkConfig () {
        return !!this.config.get('config-validated');
    }

    serverUp () {
        if (!this.checkConfig()) {
            this.connected = false;
        } else {
            this.loading = true;
            this.repository.ping().subscribe(result => {
                if (result.message === 'ok') {
                    this.connected = true;
                }
                this.loading = false;
            }, err => {
                this.connected = false;
                this.loading = false;
            });
        }
    }
}
