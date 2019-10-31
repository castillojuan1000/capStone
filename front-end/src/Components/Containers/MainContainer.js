import { connect } from 'react-redux';
import Footer from '../Footer/footer';
import AlbumPage from '../../pages/albumPage.js';
import ArtistPage from '../../pages/artistPage.js';
import SearchSection from '../../pages/search';
import LibrarySection from '../../pages/library';
import { playSong, PlayNext } from '../../utilityFunctions/util';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
	setSearch: payload => {
		dispatch({ type: 'SET_SEARCH', payload });
	},
	clearSearchState: () => {
		dispatch({ type: 'CLEAR_SEARCH_STATE' });
	},
	setSearchResult: payload => {
		dispatch({ type: 'SEARCH_RESULT_RETURNED', payload });
	},
	setSearchFilter: payload => {
		dispatch({ type: 'SET_SEARCH_FILTER', payload });
	},
	setCurrentScroll: payload => {
		dispatch({ type: 'SET_CURRENT_SCROLL', payload });
	},
	extendSearchResults: payload => {
		dispatch({type: 'EXTEND_SEARCH_RESULTS', payload})
	},
	playSong: payload => {
		dispatch({type: 'PLAY_SONG', payload})
	},
	playerStateChange: payload => {
		dispatch({type: 'PLAYER_SET_STATE', payload})
	},
	playerSetArtistID: payload => {
		dispatch({type: 'PLAYER_SET_ARTIST_ID', payload})
	},
	setCurrentTime: payload => {
		dispatch({type: 'PLAYER_SET_CURRENT_TIME', payload})
	},
	togglePlay: payload => {
		dispatch({type: 'PLAYER_TOGGLE_PLAY', payload})
	},
	initializeSpotify: payload => {
		alert(2)
		dispatch({type: 'INITIALIZE_SPOTIFY_KEYS', payload})
	},
	PlayNext: payload => {
		alert(2)
		dispatch({type: 'PLAYER_PLAY_NEXT', payload})
	}
});

export const FooterContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Footer);

export const AlbumContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AlbumPage);
export const ArtistContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ArtistPage);
export const SearchSectionContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchSection);

export const LibrarySectionContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LibrarySection);
