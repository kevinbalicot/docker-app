'use strict';

import { Component } from '@angular/core';
import { DockerRepository } from './../services/docker-repository';

@Component({
    selector: 'docker-app-add-image',
    styles: ['.logs { max-height: 200px; overflow: auto; }'],
    template: `
    <h3>Add new image</h3>
    <div class="alert alert-info logs alert-dismissible" *ngIf="!!result">
        <button type="button" class="close" (click)="clear()"><span>&times;</span></button>
        <p>Creating ...</p>
        <p *ngFor="let res of result">{{ res.toString() }}</p>
    </div>
    <form (submit)="submit($event)">
        <div class="form-group">
            <label for="image">Image name</label>
            <input type="text" id="image" class="form-control" required="required" [(ngModel)]="image" placeholder="node" />
        </div>
        <div class="form-group">
            <label for="version">Version</label>
            <input type="text" id="version" class="form-control" required="required" [(ngModel)]="version" placeholder="latest"/>
        </div>
        <button type="submit" class="btn btn-success" [ngClass]="{ 'disabled': !validate() }" [disabled]="!validate()" [disabled]="loading">
            Create <i *ngIf="loading" class="fa fa-pulse fa-spinner"></i>
        </button>
        <button type="reset" class="btn btn-defautl">Reset</button>
    </form>
    `
})
export class AddImage {

    constructor (repository: DockerRepository) {
        this.image = null;
        this.version = null;

        this.repository = repository;
        this.loading = false;
        this.result = null;
    }

    clear () {
        this.result = null;
    }

    submit (event) {
        this.loading = true;
        this.result = null;
        this.repository.createImage(this.image, this.version || 'latest').subscribe(result => {
            this.image = null;
            this.version = null;

            this.result = result;
            this.loading = false;
        }, err => {
            this.loading = false;
        });
    }

    validate () {
        return !!this.image && !!this.version;
    }
}
