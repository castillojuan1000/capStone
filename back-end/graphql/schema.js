const { gql } = require('apollo-server-express');
const typDefs = gql`
	type User {
		id: ID!
		email: String!
		likes: [Like]
		messages: [Message]
	}
	type Room {
		id: ID!
		host: User!
		roomName: String!
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
		user: User!
		room: Room
		message: String!
	}
	type Like {
		user: User
		song: Song
		room: Room
	}
	type Query {
		getUser(id: Int!): User!
		getUserByEmail(email: String!): User!
		getRoom(id: Int!): Room!
		getSong(spotifyId: Int!): Song!
		getAllSongs: [Song]
	}
	type Mutation {
		createUser(email: String!, password: String!): User!
		createRoom(hostId: Int!, roomName: String!): Room!
		createMessage(userId: Int!, roomId: Int!, message: String!): Message!
		createLike(userId: Int!, roomId: Int!, songId: Int!): Like
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
