const UUID = require("uuid-int");

class Identifier {
    constructor () {
        const id = 0;
        const generator = UUID(id);

        return generator.uuid();
    }
}

exports = Identifier;