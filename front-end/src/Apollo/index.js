import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
const client = new ApolloClient({
	uri: '/graphql'
});

export const GET_ROOM = gql`
	query getRoom($id: Int!) {
		getRoom(id: $id) {
			roomName
			host {
				username
				id
			}
			messages {
				user {
					username
				}
				message
			}
			likes {
				room {
					id
				}
				user {
					id
				}
				spotifyId
			}
		}
	}
`;
export const GET_ALL_ROOMS = gql`
	query getAllRooms {
		getAllRooms {
			id
			roomName
			host {
				id
			}
		}
	}
`;

// *** Mutations

export const CREATE_LIKE = gql`
	mutation createLike($userId: Int!, $roomId: Int!, $spotifyId: String!) {
		createLike(userId: $userId, roomId: $roomId, spotifyId: $spotifyId) {
			room {
				likes {
					user {
						username
					}
				}
			}
		}
	}
`;
export const CREATE_ROOM = gql`
	mutation createRoom($hostId: Int!, $roomName: String!) {
		createRoom(hostId: $hostId, roomName: $roomName) {
			host {
				username
			}
		}
	}
`;

export default client;
