'use strict';

export class Log {

    constructor (id = null, status = null, error = null, deleted = null, untagged = null) {
        this.id = id;
        this.status = status;
        this.error = error;
        this.deleted = deleted;
        this.untagged = untagged;
    }

    toString () {
        if (!!this.error) {
            return this.error;
        }

        return !!this.id ? `${this.id} - ${this.status || this.deleted || this.untagged}` : this.status || this.deleted || this.untagged;
    }

    static unserialize (data) {

        return new Log (
            data.id || null,
            data.status || null,
            data.error || null,
            data.Deleted || null,
            data.Untagged || null
        );
    }
}
