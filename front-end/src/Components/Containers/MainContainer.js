import { connect } from 'react-redux';
import Footer from '../Footer/footer';
import AlbumPage from '../../pages/albumPage.js';
import ArtistPage from '../../pages/artistPage.js';
import SearchSection from '../../pages/search';
import { playSong } from '../../utilityFunctions/util';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
	setSearch: payload => {
		dispatch({ type: 'SET_SEARCH', payload });
	},
	clearSearchState: () => {
		dispatch({ type: 'CLEAR_SEARCH_STATE' });
	},
	setSearchResult: payload => {
		console.info("payload", payload)
		dispatch({ type: 'SEARCH_RESULT_RETURNED', payload });
	},
	setSearchFilter: payload => {
		console.info("payload", payload)
		dispatch({ type: 'SET_SEARCH_FILTER', payload });
	},
	setCurrentScroll: payload => {
		console.info("payload", payload)
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
