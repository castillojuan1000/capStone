import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';

const client = new ApolloClient({
	uri: 'http://localhost:4000/graphql'
});

export default client;

export const GET_ROOM = gql`
	query getRoom($id: Int!) {
		getRoom(id: $id) {
			roomName
			host {
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
