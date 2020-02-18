const { gql } = require("apollo-server-express");
const typDefs = gql`
  type User {
    id: ID!
    email: String!
    username: String
    likes: [Like]
    messages: [Message]
  }
  type Room {
    id: ID!
    host: User
    roomName: String
    spotifyId: String
    likes: [Like]
    songs: [Song]
    messages: [Message]
  }
  type Song {
    id: Int!
    room: Room
    order: Int
    spotifyId: String!
    songImg: String
    songLength: Int!
    likes: [Like]
  }
  type Message {
    id: Int!
    user: User
    room: Room
    message: String!
  }
  type Like {
    user: User
    spotifyId: String!
    room: Room
  }
  type Query {
    getUser(id: Int!): User
    getUserByEmail(email: String!): User
    getRoom(id: Int!): Room
    getAllRooms: [Room]
    getSong(spotifyId: Int!): Song
    getAllSongs: [Song]
  }
  type Mutation {
    createUser(email: String!, password: String!, username: String!): User
    createRoom(hostId: Int!, roomName: String!, spotifyId: String!): Room
    createMessage(userId: Int!, roomId: Int!, message: String!): Message
    createLike(userId: Int!, roomId: Int!, spotifyId: String!): Like
    createSong(
      roomId: Int!
      spotifyId: Int!
      songImg: String
      songLength: String!
    ): Song!
    removeRoom(id: Int): String!
    removeUser(id: Int): String!
  }
`;

module.exports = typDefs;
