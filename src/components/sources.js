'use strict';

import { Component } from '@angular/core';
import { GitRepository } from './../services/git-repository';

@Component({
    selector: 'docker-app-sources',
    styles: ['.btn-group { margin: 10px 0; }', '.logs { max-height: 150px; overflow: auto; }'],
    template: `
    <h3>Sources</h3>
    <header class="btn-group">
        <button (click)="refresh()" class="btn btn-xs btn-default" [disabled]="loading">
            Refresh <i class="fa fa-refresh" [ngClass]="{ 'fa-spin': loading }"></i>
        </button>
    </header>
    <div class="alert alert-info logs alert-dismissible" *ngIf="!!result">
        <button type="button" class="close" (click)="clear()"><span>&times;</span></button>
        <p *ngFor="let res of result">{{ res.toString() }}</p>
    </div>
    <table class="table">
        <tr><th>Name</th><th>Actions</th><tr>
        <tr *ngFor="let repo of repositories">
            <td>{{ repo }}</td><td></td>
        </tr>
    </table>
    <h4>Create new repository</h4>
    <form (submit)="createRepository($event)">
        <div class="form-group">
            <label for="name">Repository name</label>
            <input type="text" id="name" class="form-control" required="required" [(ngModel)]="name" />
        </div>
        <button type="submit" class="btn btn-success" [ngClass]="{ 'disabled': !validateNewRepository() }" [disabled]="!validateNewRepository()" [disabled]="loading">
            Create <i *ngIf="loading" class="fa fa-pulse fa-spinner"></i>
        </button>
        <button type="reset" class="btn btn-defautl">Reset</button>
    </form>
    `
})
export class Sources {

    constructor (repository: GitRepository) {
        this.name = null;

        this.loading = false;
        this.result = null;
        this.repository = repository;
        this.refresh();
    }

    validateNewRepository () {
        return !!this.name;
    }

    clear () {
        this.result = null;
    }

    refresh () {
        this.loading = true;

        this.repository.getRepositories()
            .subscribe(repositories => {
                this.repositories = repositories;
                this.loading = false;
            }, err => {
                this.loading = false;
            });
    }

    createRepository (event) {
        event.preventDefault();

        this.loading = true;
        this.repository.createRepository(this.name).subscribe(result => {
            this.name = null;

            this.result = result;
            this.loading = false;
            this.refresh();
        }, err => {
            this.loading = false;
        });
    }
}
