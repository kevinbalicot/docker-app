'use strict';

import { Injectable } from '@angular/core';
import { Configuration } from './config';
import { Log } from './../models/log';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GitRepository {

    constructor (http: Http, config: Configuration) {
        this.config = config;
        this.http = http;
    }

    getUrl () {
        return `${this.config.get('config-url')}:${this.config.get('config-port')}`;
    }

    getRepositories () {
        return this.http.get(`${this.getUrl()}/repositories`)
            .map(res => res.json());
    }

    createRepository (name) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post(`${this.getUrl()}/repositories`, `name=${name}`, { headers: headers })
            .map(res => res.json().map(log => Log.unserialize(log)));
    }
}
