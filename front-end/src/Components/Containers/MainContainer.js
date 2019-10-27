import { connect } from 'react-redux';
import Footer from '../Footer/footer';
import AlbumPage from '../../pages/albumPage.js';
import ArtistPage from '../../pages/artistPage.js';
import SearchSection from '../../pages/search';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
	setSearch: payload => {
		dispatch({ type: 'SET_SEARCH', payload });
	},
	clearSearchState: () => {
		dispatch({ type: 'CLEAR_SEARCH_STATE' });
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
