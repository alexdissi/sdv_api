import driver from "../db/neo4j.js";

async function seed() {
  const session = driver.session();

  try {
    await session.run(`MATCH (n) DETACH DELETE n`);

    const cities = [
      "PAR",
      "NYC",
      "LON",
      "BER",
      "MAD",
      "ROM",
      "AMS",
      "BKK",
      "DXB",
      "SIN",
    ];

    for (const code of cities) {
      await session.run(`CREATE (:City {code: $code})`, { code });
    }

    for (const from of cities) {
      for (const to of cities) {
        if (from !== to && Math.random() < 0.3) {
          await session.run(
            `MATCH (a:City {code: $from}), (b:City {code: $to})
             CREATE (a)-[:NEAR {weight: $weight}]->(b)`,
            { from, to, weight: Math.floor(Math.random() * 10 + 1) }
          );
        }
      }
    }

    console.log(
      `✅ Seeded ${cities.length} cities and random NEAR relationships`
    );
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
    process.exit();
  }
}

seed();
