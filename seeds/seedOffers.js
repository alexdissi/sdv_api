import mongoose from '../db/mongo.js';
import Offer from '../models/Offer.js';

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seed() {
  await mongoose.connection.dropCollection('offers').catch(() => {});

  const cities = ['PAR', 'NYC', 'LON', 'BER', 'MAD', 'ROM', 'AMS', 'BKK', 'DXB', 'SIN'];
  const providers = ['Air France', 'Delta', 'Lufthansa', 'KLM', 'Emirates', 'Singapore Airlines'];
  const hotels = ['Hilton', 'Marriott', 'Ibis', 'Ritz', 'Sheraton', 'Accor'];

  const offers = [];

  for (let i = 0; i < 1000; i++) {
    const from = cities[randomInt(0, cities.length - 1)];
    let to;
    do {
      to = cities[randomInt(0, cities.length - 1)];
    } while (to === from);

    const departDate = randomDate(new Date('2025-07-01'), new Date('2025-12-31'));
    const returnDate = new Date(departDate.getTime() + randomInt(3, 14) * 24 * 60 * 60 * 1000);

    offers.push({
      from,
      to,
      departDate,
      returnDate,
      provider: providers[randomInt(0, providers.length - 1)],
      price: randomInt(100, 1200),
      currency: 'EUR',
      legs: [
        { flightNum: `AF${randomInt(1000, 9999)}`, dep: from, arr: to, duration: `${randomInt(1, 12)}h` }
      ],
      hotel: {
        name: hotels[randomInt(0, hotels.length - 1)],
        nights: randomInt(3, 10),
        price: randomInt(300, 1500)
      },
      activity: {
        title: `Activity ${randomInt(1, 20)}`,
        price: randomInt(50, 300)
      }
    });
  }

  await Offer.insertMany(offers);
  console.log(`✅ Seeded ${offers.length} offers`);
  process.exit();
}

seed();