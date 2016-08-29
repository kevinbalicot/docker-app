'use strict';

import { Component } from '@angular/core';
import { ListContainer } from './list-container';
import { ListImage } from './list-image';
import { AddImage } from './add-image';
import { AddContainer } from './add-container';
import { Sources } from './sources';
import { Config } from './config';
import { Configuration } from './../services/config';
import { Menu } from './menu';

@Component({
    selector: 'docker-app',
    directives: [ AddContainer, ListContainer, AddImage, ListImage, Config, Sources, Menu ],
    template: `
    <docker-app-menu></docker-app-menu>
    <section class="container">
        <ul class="nav nav-tabs" role="tablist">
            <li class="active">
                <a href="#home" aria-controls="home" data-toggle="tab" title="Home">
                    <i class="fa fa-home"></i>
                </a>
            </li>
            <li>
                <a href="#add-image" aria-controls="add-image" data-toggle="tab" title="Add image">
                    Add image
                </a>
            </li>
            <li>
                <a href="#add-container" aria-controls="add-container" data-toggle="tab" title="Add container">
                    Add container
                </a>
            </li>
            <li>
                <a href="#sources" aria-controls="sources" data-toggle="tab" title="Show docker sources">
                    Sources
                </a>
            </li>
            <li class="pull-right">
                <a href="#config" aria-controls="config" data-toggle="tab" title="Configuration">
                    <i class="fa fa-cog"></i>
                </a>
            </li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane active" id="home">
                <section *ngIf="checkConfig()">
                    <docker-app-list-image></docker-app-list-image>
                    <docker-app-list-container></docker-app-list-container>
                </section>
                <section *ngIf="!checkConfig()">
                    <h3>Oops :(</h3>
                    <div class="alert alert-warning">
                        <p>Need to configure url and port of server.</p>
                    </div>
                </section>
            </div>
            <div class="tab-pane" id="add-image">
                <docker-app-add-image></docker-app-add-image>
            </div>
            <div class="tab-pane" id="add-container">
                <docker-app-add-container></docker-app-add-container>
            </div>
            <div class="tab-pane" id="sources">
                <docker-app-sources></docker-app-sources>
            </div>
            <div class="tab-pane" id="config">
                <h3>Configuration</h3>
                <docker-app-configuration-component></docker-app-configuration-component>
            </div>
        </div>
    </section>
    `
})
export class App {

    constructor (config: Configuration) {
        this.config = config;
    }

    checkConfig () {
        return !!this.config.get('config-validated');
    }
}
