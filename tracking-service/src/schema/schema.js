const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLList, GraphQLNonNull } = require('graphql');
const Tracking = require('../models/Tracking');

const TrackingType = new GraphQLObjectType({
  name: 'Tracking',
  fields: () => ({
    id: { type: GraphQLString },
    flightNumber: { type: GraphQLString },
    status: { type: GraphQLString },
    currentLocation: { type: GraphQLString },
    altitude: { type: GraphQLFloat },
    updatedAt: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getTracking: {
      type: TrackingType,
      args: { flightNumber: { type: GraphQLString } },
      resolve(parent, args) {
        return Tracking.findOne({ flightNumber: args.flightNumber });
      }
    },
    getAllTracking: {
      type: new GraphQLList(TrackingType),
      resolve() {
        return Tracking.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updateFlightStatus: {
      type: TrackingType,
      args: {
        flightNumber: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: new GraphQLNonNull(GraphQLString) },
        currentLocation: { type: new GraphQLNonNull(GraphQLString) },
        altitude: { type: GraphQLFloat }
      },
      async resolve(parent, args) {
        let tracking = await Tracking.findOne({ flightNumber: args.flightNumber });
        if (tracking) {
          tracking.status = args.status;
          tracking.currentLocation = args.currentLocation;
          if (args.altitude) tracking.altitude = args.altitude;
          tracking.updatedAt = Date.now();
          return tracking.save();
        } else {
          tracking = new Tracking({
            flightNumber: args.flightNumber,
            status: args.status,
            currentLocation: args.currentLocation,
            altitude: args.altitude || 0
          });
          return tracking.save();
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});