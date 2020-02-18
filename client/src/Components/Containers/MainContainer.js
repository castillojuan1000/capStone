import { connect } from "react-redux";
import { Footer } from "../Footer";
import { Navbar } from "../Navbar";
import { Library, Home, Album, Artist, Search } from '../Pages'

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
  setSearch: payload => {
    dispatch({ type: "SET_SEARCH", payload });
  },
  authUser: payload => {
    dispatch({ type: "LOGIN", payload });
  },
  clearSearchState: () => {
    dispatch({ type: "CLEAR_SEARCH_STATE" });
  },
  setSearchResult: payload => {
    dispatch({ type: "SEARCH_RESULT_RETURNED", payload });
  },
  setSearchFilter: payload => {
    dispatch({ type: "SET_SEARCH_FILTER", payload });
  },
  setCurrentScroll: payload => {
    dispatch({ type: "SET_CURRENT_SCROLL", payload });
  },
  extendSearchResults: payload => {
    dispatch({ type: "EXTEND_SEARCH_RESULTS", payload });
  },
  playSong: payload => {
    dispatch({ type: "PLAY_SONG", payload });
  },
  playerStateChange: payload => {
    dispatch({ type: "PLAYER_SET_STATE", payload });
  },
  playerSetArtistID: payload => {
    dispatch({ type: "PLAYER_SET_ARTIST_ID", payload });
  },
  setCurrentTime: payload => {
    dispatch({ type: "PLAYER_SET_CURRENT_TIME", payload });
  },
  togglePlay: payload => {
    dispatch({ type: "PLAYER_TOGGLE_PLAY", payload });
  },
  initializeSpotify: payload => {
    dispatch({ type: "INITIALIZE_SPOTIFY_KEYS", payload });
  },
  PlayNext: payload => {
    dispatch({ type: "PLAYER_PLAY_NEXT", payload });
  },
  SyncFromHost: () => {
    dispatch({ type: "SYNC_FROM_HOST" });
  },
  SetColors: payload => {
    dispatch({ type: "SET_PLAYER_COLORS", payload });
  },
  ResetQueue: payload => {
    dispatch({ type: "RESET_PLAYER_QUEUE", payload });
  },
  SetSecondaryColors: payload => {
    dispatch({ type: "SET_SECONDARY_COLORS", payload });
  },
  setPlayer: payload => {
    dispatch({ type: "PLAYER_SET_STATE_FROM_HOST", payload });
  },
  setRoom: payload => dispatch({ type: "SET_ROOM", payload })
});

export const FooterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);

export const AlbumContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Album);
export const ArtistContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Artist);
export const SearchSectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);

export const LibrarySectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Library);

export const NavBarSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);

export const HomePageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default {
  LibrarySectionContainer, HomePageContainer, NavBarSection, SearchSectionContainer, ArtistContainer, AlbumContainer, FooterContainer
}