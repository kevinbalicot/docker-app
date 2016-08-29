'use strict';

import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {

    constructor () {
        this.config = {};
    }

    set (name, value) {
        this.config[name] = value;
        return localStorage.setItem(name, JSON.stringify(value));
    }

    get (name) {

        if (!!this.config[name]) {
            return this.config[name];
        }

        let result = localStorage.getItem(name);

        if (!!result) {
            this.config[name] = JSON.parse(result);
        }

        return this.config[name] || null;
    }

    remove (name) {
        delete this.config[name];
        return localStorage.removeItem(name);
    }
}
