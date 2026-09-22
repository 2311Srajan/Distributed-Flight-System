const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const schema = require('./schema/schema');

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Tracking Service running on port ${PORT}`);
});