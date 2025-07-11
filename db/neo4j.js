import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "test1234"),
  { encrypted: "ENCRYPTION_OFF" }
);

try {
  await driver.verifyConnectivity();
  console.log("✅ Neo4j connected");
} catch (error) {
  console.error("❌ Neo4j connection error", error);
}

export default driver;
