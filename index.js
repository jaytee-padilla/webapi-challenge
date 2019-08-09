const api = require('./server');

const port = process.env.PORT || 7000;

api.listen(port, () => console.log(`\nAPI running on ${port}\n`));