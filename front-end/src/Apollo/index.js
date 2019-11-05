import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';

const client = new ApolloClient({
	uri: 'http://10.150.40.202:4000/graphql'
});

export default client;

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
		}
	}
`;
export const GET_ALL_ROOMS = gql`
	query getAllRooms {
		getAllRooms {
			id
			host {
				id
			}
		}
	}
`;
