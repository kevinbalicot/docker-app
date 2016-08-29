'use strict';

import { Component } from '@angular/core';
import { DockerRepository } from './../services/docker-repository';

@Component({
    selector: 'docker-app-list-image',
    styles: ['.btn-group { margin: 10px 0; }', '.logs { max-height: 150px; overflow: auto; }'],
    template: `
    <h3>Images</h3>
    <header class="btn-group">
        <button (click)="refresh()" class="btn btn-xs btn-default" [disabled]="loading">
            Refresh <i class="fa fa-refresh" [ngClass]="{ 'fa-spin': loading }"></i>
        </button>
    </header>
    <div class="alert alert-info logs alert-dismissible" *ngIf="!!result">
        <button type="button" class="close" (click)="clear()"><span>&times;</span></button>
        <p>Deleting ...</p>
        <p *ngFor="let res of result">{{ res.toString() }}</p>
    </div>
    <table class="table">
        <tr><th>Id</th><th>Tags</th><th>Created at</th><th>Actions</th><tr>
        <tr *ngFor="let image of images">
            <td><span class="label label-info">{{ image.encryptType }}</span>&nbsp;{{ image.shortId }}</td>
            <td>{{ image.tags.join() }}</td>
            <td>{{ image.createdAt | date }}</td>
            <td>
                <button class="btn btn-danger btn-xs" title="Delete" (click)="deleteImage(image)" [disabled]="deleting[image.id]">
                    <i class="fa fa-trash" *ngIf="!deleting[image.id]"></i>
                    <i class="fa fa-spinner fa-pulse" *ngIf="deleting[image.id]"></i>
                </button>
            </td>
        </tr>
    </table>
    <div class="alert alert-info" *ngIf="images.length === 0" role="alert">Aucune images.</div>
    `
})
export class ListImage {

    constructor (repository: DockerRepository) {
        this.images = [];
        this.repository = repository;
        this.loading = false;
        this.deleting = [];
        this.result = null;
        this.refresh();
    }

    clear () {
        this.result = null;
    }

    refresh () {
        this.loading = true;

        this.repository.getImages()
            .subscribe(images => {
                this.images = images;
                this.loading = false;
            }, err => {
                this.loading = false;
            });
    }

    deleteImage (image) {
        this.deleting[image.id] = true;
        this.result = null;

        this.repository.deleteImage(image.tags[0])
            .subscribe(result => {
                this.result = result;
                this.deleting[image.id] = false;
                this.refresh();
            }, err => {
                this.deleting[image.id] = false;
            });
    }
}
