'use strict';

export class Container {

    constructor (id, names = [], image = null, command = null, status = null, createdAt = null, network = []) {
        this.id = id;
        this.names = names;
        this.image = image.substring(0, 15);
        this.command = command;
        this.status = status;
        this.createdAt = createdAt;
        this.network = network;

        this.shortId = this.id.substring(0, 8);
    }

    static unserialize (data) {

        if (!!data.Id) {
            return new Container (
                data.Id,
                data.Names || [],
                data.Image || null,
                data.Command || null,
                data.Status || null,
                !!data.Created ? new Date(data.Created) : null,
                data.Ports[0]
            );
        }

        return null;
    }
}
