// writeOrder.js

const writeOrder = async (db, data) => {
  await db.connect();
  // Get the collection
  const collection = db.collection('hzbay');


  try {
    const result = await collection.insertOne(data);
    console.log('Data inserted successfully:', result.insertedId);
  } catch (err) {
    console.error('Error inserting data:', err);
    throw 'Error inserting data:';
  }
  finally {
    await client.close();
  }
};

module.exports = writeOrder;