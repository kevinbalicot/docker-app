'use strict';

import { Injectable } from '@angular/core';
import { Configuration } from './config';
import { Image } from './../models/image';
import { Container } from './../models/container';
import { Log } from './../models/log';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DockerRepository {

    constructor (http: Http, config: Configuration) {
        this.config = config;
        this.http = http;
    }

    getUrl () {
        return `${this.config.get('config-url')}:${this.config.get('config-port')}`;
    }

    getContainers () {
        return this.http.get(`${this.getUrl()}/containers`)
            .map(res => res.json().map(container => Container.unserialize(container)));
    }

    deleteContainer (id) {
        return this.http.delete(`${this.getUrl()}/containers/${id}`)
            .map(res => res.json().map(log => Log.unserialize(log)));
    }

    stopContainer (id) {
        return this.http.post(`${this.getUrl()}/containers/${id}/stop`)
            .map(res => res.json().map(log => Log.unserialize(log)));
    }

    killContainer (id) {
        return this.http.post(`${this.getUrl()}/containers/${id}/kill`)
            .map(res => res.json().map(log => Log.unserialize(log)));
    }

    startContainer (id) {
        return this.http.post(`${this.getUrl()}/containers/${id}/start`)
            .map(res => res.json().map(log => Log.unserialize(log)));
    }

    createContainer (params, name) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(`${this.getUrl()}/containers/run`, JSON.stringify(params), { headers: headers })
            .map(res => res.json().map(log => Log.unserialize(log)));
    }

    getImages () {
        return this.http.get(`${this.getUrl()}/images`)
            .map(res => res.json().map(image => Image.unserialize(image)));
    }

    createImage (image, version) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post(`${this.getUrl()}/images`, `image=${image}:${version}`, { headers: headers })
            .map(res => res.json().map(log => Log.unserialize(log)));
    }

    deleteImage (name) {
        return this.http.delete(`${this.getUrl()}/images/${name}?force=1`)
            .map(res => res.json().map(log => Log.unserialize(log)));
    }

    ping () {
        return this.http.get(`${this.getUrl()}/hello`)
            .map(res => res.json());
    }
}
