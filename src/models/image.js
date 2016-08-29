'use strict';

export class Image {

    constructor (id, tags = [], labels = [], size = 0, createdAt = null) {
        this.id = id;
        this.tags = tags;
        this.labels = labels;
        this.size = size;
        this.createdAt = createdAt;

        var idInfo = this.id.split(':');

        if (idInfo.length > 1) {
            this.encryptType = idInfo[0];
            this.shortId = idInfo[1].substring(0, 8);
        } else {
            this.encryptType = null;
            this.shortId = this.id.substring(0, 8);
        }
    }

    static unserialize (data) {

        if (!!data.Id) {
            return new Image (
                data.Id,
                data.RepoTags || [],
                data.Labels || [],
                data.Size || 0,
                !!data.Created ? new Date(data.Created) : null
            );
        }

        return null;
    }
}
