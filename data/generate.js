const fs = require('fs');
const Fakerator = require('fakerator');
const veggies = require('./products');

// My home location latitude and longitude
const home = {
  lat: 39.9420508,
  lng: -86.0236932
};

// Generating random products to apply to the stores
const pickProducts = count => {
  const products = [];
  const copy = veggies.slice();
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * copy.length);
    products.push(copy[index]);
    copy.splice(index, 1);
  }
  return products.sort();
};

// Generating a random position for the latitude and longitude
const randomPosition = (center, radius) => {
  const w = (radius / 69.158614) * Math.sqrt(Math.random());
  const t = 2 * Math.PI * Math.random();
  return {
    lat: w * Math.sin(t) + center.lat,
    lng: w * Math.cos(t) + center.lng
  };
};

let id = 1;
const data = [];

// Generating the random amount of stores and there distances away
[5, 10, 25, 50].forEach(distance => {
  for (let i = 0; i < 25; i++) {
    const fakerator = Fakerator();

    data.push({
      id,
      name: fakerator.company.name(),
      address: {
        street: fakerator.address.street(),
        city: fakerator.address.city(),
        postCode: fakerator.address.postCode()
      },
      phone: fakerator.phone.number(),
      position: randomPosition(home, distance),
      products: pickProducts(20).map(name => ({
        name,
        price: Math.floor(Math.random() * 9) + 1.99
      }))
    });
    id++;
  }
});

fs.writeFileSync('data/data.json', JSON.stringify(data, null, 2));
fs.writeFileSync(
  'data/locations.js',
  `module.exports = ${JSON.stringify(data, null, 2)};`
);
