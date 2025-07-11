import driver from "../db/neo4j.js";

async function seed() {
  const session = driver.session();

  try {
    await session.run(`MATCH (n) DETACH DELETE n`);

    const cities = [
      { code: "PAR", name: "Paris", country: "FR" },
      { code: "NYC", name: "New York", country: "US" },
      { code: "LON", name: "London", country: "UK" },
      { code: "BER", name: "Berlin", country: "DE" },
      { code: "MAD", name: "Madrid", country: "ES" },
      { code: "ROM", name: "Rome", country: "IT" },
      { code: "AMS", name: "Amsterdam", country: "NL" },
      { code: "BKK", name: "Bangkok", country: "TH" },
      { code: "DXB", name: "Dubai", country: "AE" },
      { code: "SIN", name: "Singapore", country: "SG" },
    ];

    for (const city of cities) {
      await session.run(
        `CREATE (:City {code: $code, name: $name, country: $country})`,
        city
      );
    }

    for (const from of cities) {
      for (const to of cities) {
        if (from.code !== to.code && Math.random() < 0.3) {
          const weight = parseFloat((Math.random() * 0.5 + 0.5).toFixed(2)); // entre 0.5 et 1.0

          await session.run(
            `MATCH (a:City {code: $from}), (b:City {code: $to})
             CREATE (a)-[:NEAR {weight: $weight}]->(b),
                    (b)-[:NEAR {weight: $weight}]->(a)`,
            { from: from.code, to: to.code, weight }
          );
        }
      }
    }

    console.log(`✅ Seeded ${cities.length} cities with NEAR relationships`);
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    await session.close();
    process.exit();
  }
}

seed();
