'use strict';

import { Component } from '@angular/core';
import { DockerRepository } from './../services/docker-repository';

@Component({
    selector: 'docker-app-list-container',
    styles: ['.btn-group { margin: 10px 0; }'],
    template: `
    <h3>Containers</h3>
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
        <tr><th>Id</th><th>Image</th><th>Command</th><th>Names</th><th>Network</th><th>Status</th><th>Actions</th><tr>
        <tr *ngFor="let container of containers">
            <td>{{ container.shortId }}</td>
            <td>{{ container.image }}</td>
            <td>{{ container.command }}</td>
            <td>{{ container.names }}</td>
            <td>{{ container.network | json }}</td>
            <td>{{ container.status }}</td>
            <td>
                <button class="btn btn-success btn-xs" title="Start" (click)="startContainer(container)" [disabled]="starting[container.id]">
                    <i class="fa fa-play" *ngIf="!starting[container.id]"></i>
                    <i class="fa fa-spinner fa-pulse" *ngIf="starting[container.id]"></i>
                </button>
                <button class="btn btn-primary btn-xs" title="Stop" (click)="stopContainer(container)" [disabled]="stopping[container.id]">
                    <i class="fa fa-stop" *ngIf="!stopping[container.id]"></i>
                    <i class="fa fa-spinner fa-pulse" *ngIf="stopping[container.id]"></i>
                </button>
                <button class="btn btn-warning btn-xs" title="kill" (click)="killContainer(container)" [disabled]="killing[container.id]">
                    <i class="fa fa-eject" *ngIf="!killing[container.id]"></i>
                    <i class="fa fa-spinner fa-pulse" *ngIf="killing[container.id]"></i>
                </button>
                <button class="btn btn-danger btn-xs" title="Delete" (click)="deleteContainer(container)" [disabled]="deleting[container.id]">
                    <i class="fa fa-trash" *ngIf="!deleting[container.id]"></i>
                    <i class="fa fa-spinner fa-pulse" *ngIf="deleting[container.id]"></i>
                </button>
            </td>
        </tr>
    </table>
    <div class="alert alert-info" *ngIf="containers.length === 0" role="alert">Aucun container.</div>
    `
})
export class ListContainer {

    constructor (repository: DockerRepository) {
        this.containers = [];
        this.repository = repository;
        this.loading = false;
        this.deleting = [];
        this.stopping = [];
        this.starting = [];
        this.killing = [];
        this.result = null;
        this.refresh();
    }

    refresh () {
        this.loading = true;

        this.repository.getContainers()
            .subscribe(containers => {
                this.containers = containers;
                this.loading = false;
            }, err => {
                this.loading = false;
            });
    }

    clear () {
        this.result = null;
    }

    deleteContainer (container) {
        this.deleting[container.id] = true;
        this.result = null;

        this.repository.deleteContainer(container.id)
            .subscribe(result => {
                this.result = result;
                this.deleting[container.id] = false;
                this.refresh();
            }, err => {
                this.deleting[container.id] = false;
            });
    }

    stopContainer (container) {
        this.stopping[container.id] = true;
        this.result = null;

        this.repository.stopContainer(container.id)
            .subscribe(result => {
                this.result = result;
                this.stopping[container.id] = false;
                this.refresh();
            }, err => {
                this.stopping[container.id] = false;
            });
    }

    startContainer (container) {
        this.starting[container.id] = true;
        this.result = null;

        this.repository.startContainer(container.id)
            .subscribe(result => {
                this.result = result;
                this.starting[container.id] = false;
                this.refresh();
            }, err => {
                this.starting[container.id] = false;
            });
    }

    killContainer (container) {
        this.killing[container.id] = true;
        this.result = null;

        this.repository.killContainer(container.id)
            .subscribe(result => {
                this.result = result;
                this.killing[container.id] = false;
                this.refresh();
            }, err => {
                this.killing[container.id] = false;
            });
    }
}
