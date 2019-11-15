import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
const client = new ApolloClient({
  uri:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000/graphql"
      : "/graphql"
});

export const GET_ROOM = gql`
  query getRoom($id: Int!) {
    getRoom(id: $id) {
      roomName
      spotifyId
      host {
        username
        id
        spotifyId
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
      spotifyId
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
          host {
            id
            username
            spotifyId
          }
        }
      }
    }
  }
`;
export const CREATE_ROOM = gql`
  mutation createRoom($hostId: Int!, $roomName: String!, $spotifyId: String!) {
    createRoom(hostId: $hostId, roomName: $roomName, spotifyId: $spotifyId) {
      id
      roomName
      spotifyId
      host {
        id
        username
        spotifyId
      }
    }
  }
`;

export default client;
