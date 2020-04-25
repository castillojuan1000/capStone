import { Room } from '../Pages'
import { connect } from 'react-redux'


const mapState = state => {
    return { ...state };
};
const mapDispatch = dispatch => {
    return {
        setRoom: payload => dispatch({ type: 'SET_ROOM', payload }),
        ResetQueue: payload => {
            dispatch({ type: 'RESET_PLAYER_QUEUE', payload });
        }
    };
};
export default connect(mapState, mapDispatch)(Room);