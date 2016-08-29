'use strict';

import { Component } from '@angular/core';
import { DockerRepository } from './../services/docker-repository';

@Component({
    selector: 'docker-app-add-container',
    template: `
    <h3>Add new container</h3>
    <div class="alert alert-info logs alert-dismissible" *ngIf="!!result">
        <button type="button" class="close" (click)="clear()"><span>&times;</span></button>
        <p>Running ...</p>
        <p *ngFor="let res of result">{{ res.toString() }}</p>
    </div>
    <form (submit)="submit($event)">
        <div class="form-group">
            <label for="name">Container name</label>
            <input type="text" id="name" class="form-control" required="required" [(ngModel)]="name" />
        </div>
        <div class="form-group">
            <label for="params">Parameters (json syntaxe) <a href="https://docs.docker.com/engine/reference/api/docker_remote_api_v1.23/#/create-a-container" target="_blank">Doc</a></label>
            <textarea type="text" id="params" class="form-control" rows="5" required="required" [(ngModel)]="params"></textarea>
        </div>
        <p>
            Validation&nbsp;
            <span class="label label-danger" *ngIf="!jsonValidate()">Invalid json</span>
            <span class="label label-success" *ngIf="jsonValidate()">Ok</span>
        </p>
        <button type="submit" class="btn btn-success" [ngClass]="{ 'disabled': !validate() }" [disabled]="!validate()" [disabled]="loading">
            Create <i *ngIf="loading" class="fa fa-pulse fa-spinner"></i>
        </button>
        <button type="reset" class="btn btn-defautl">Reset</button>
    </form>
    `
})
export class AddContainer {

    constructor (repository: DockerRepository) {
        this.name = null;
        this.params = null;

        this.repository = repository;
        this.loading = false;
        this.result = null;
    }

    clear () {
        this.result = null;
    }

    submit (event) {
        event.preventDefault();

        this.loading = true;
        this.result = null;
        this.repository.createContainer(JSON.parse(this.params), this.name).subscribe(result => {
            this.name = null;
            this.params = null;
            
            this.result = result;
            this.loading = false;
        }, err => {
            this.loading = false;
        });
    }

    validate () {
        return !!this.name && !!this.jsonValidate();
    }

    jsonValidate () {
        if (!this.params) {
            return false;
        }

        try {
            JSON.parse(this.params);
            return true;
        } catch (e) {
            return false;
        }
    }
}
