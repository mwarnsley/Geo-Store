const Koa = require('koa');
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const { buildSchema } = require('graphql');
const originalLocations = require('../data/locations');
const products = require('../data/products');

// Function that gets the miles and distance when switching between seeing specific places in a certain distance
const distance = (p1, p2) => {
  const toRad = Value => (Value * Math.PI) / 180;
  const R = 3958.7558657440545;
  const dLat = toRad(p2.lat - p1.lat);
  const dLon = toRad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(p1.lat)) *
      Math.cos(toRad(p2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Takes the original locations and filters them down based on the parameters that are provided
const locations = ({ lat, lng, radius = 5, search = '', price = 10 }) =>
  originalLocations.filter(loc => {
    if (
      distance(
        {
          lat,
          lng
        },
        loc.position
      ) > radius
    ) {
      return false;
    }
    if (search.length > 0) {
      // If there is a search specified then we make sure there is at least 1 product in the specified search
      const re = new RegExp(search, 'i');
      let found = false;
      loc.products.forEach(p => {
        if (re.test(p.name) && p.price < price) {
          found = true;
        }
      });
      if (!found) {
        return false;
      }
    }
    return true;
  });

const app = new Koa();

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(app.env === 'production');

// Building out the graphql schema for the layout of the data
const schema = buildSchema(`
  type Product {
    name: String!
    price: Float!
  }
  type Address {
    city: String!
    street: String!
    postCode: String!
  }
  type Position {
    lng: Float!
    lat: Float!
  }
  type Location {
    id: String!
    name: String!
    position: Position!
    phone: String!
    address: Address!
    products: [Product]!
  }
  type Query {
    locations(
      lat: Float!
      lng: Float!
      radius: Float!
      search: String
      price: Float
    ): [Location]!
    products: [String]!
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  locations,
  products: () => products
};

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server;

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Mounting to the graphql Server
  app.use(
    mount(
      '/graphql',
      graphqlHTTP({
        schema,
        rootValue: root,
        graphiql: true
      })
    )
  );

  app.use(ctx => {
    ctx.status = 200;
    ctx.respond = false; // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res);
  });

  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}

start();
