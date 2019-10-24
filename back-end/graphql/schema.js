const { gql } = require('apollo-server-express');
const typDefs = gql`
	type User {
		id: ID!
		email: String!
		password: String!
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
		room: Room
		order: Int
		spotifyId: String!
		songImg: String
		songLength: Int!
	}
	type Message {
		user: User!
		room: Room!
		message: String!
	}
	type Like {
		user: User!
		song: Song!
		room: Room!
	}
	type Query {
		getUser(id: Int!): User!
		getRoom(id: Int!): Room!
		getUserRooms(id: Int!): [Room!]
		getUserMessages(id: Int!): [Message!]
		getUserLikes(id: Int!): [Like!]
		getRoomSongs(id: Int!): [Song!]
		getRoomMessages(id: Int!): [Message!]
		getSongLikes(id: Int!): [Like!]
		getSong(id: Int!): Song!
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
