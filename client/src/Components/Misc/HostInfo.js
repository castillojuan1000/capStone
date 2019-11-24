import React, { useEffect, useState } from 'react'

export default function HostInfo({ spotifyData, host, user }) {
    const [state, setState] = useState({
        displayName: '',
        externalUrl: '',
        followers: 0,
        image: '',
        isFollowed: false
    });
    const { isHost } = user.room.host;
    useEffect(() => {
        Promise.all([
            spotifyData.player.getUserProfile(host.spotifyId),
            spotifyData.player.isFollowing('user', host.spotifyId)
        ]).then(results => {
            const [userData, isFollowingHost] = results;
            let isFollowing = isFollowingHost[0];
            if (isHost) {
                isFollowing = true;
            }
            const image = userData.images.length
                ? userData.images[0].url
                : `https://avatars.dicebear.com/v2/initials/${userData.display_name[0] +
                userData
                    .display_name[1]}.svg?options[backgroundColors][]=grey&options[backgroundColorLevel]=500&options[fontSize]=29&options[bold]=1`;
            const hostObject = {
                displayName: userData['display_name'],
                externalUrl: userData.externalUrl,
                followers: userData.followers.total,
                image: image,
                isFollowed: isFollowing
            };
            setState(hostObject);
        });
    }, [spotifyData, setState, host, isHost]);
    const followHost = () => {
        if (!state.isFollowed) {
            spotifyData.player.followArtist('user', host.spotifyId).then(results => {
                setState({ ...state, isFollowed: !state.isFollowed });
            });
        } else {
            spotifyData.player
                .UnfollowArtist('user', host.spotifyId)
                .then(results => {
                    setState({ ...state, isFollowed: !state.isFollowed });
                });
        }
    };
    let bannerStyle = { backgroundImage: `url('${state.image}')` };
    return (
        <>
            <div className='host-top-section'>
                <div className='host-left-section'>
                    <div className='host-banner' style={bannerStyle}></div>
                </div>
                <div className='host-description'>
                    <h1>{state.displayName}</h1>
                    <div className='host-button'>
                        <div>
                            <button
                                className='btn btn-secondary'
                                onClick={state.isFollowed && followHost}>
                                {state.isFollowed ? 'Followed' : 'Follow'}
                            </button>
                        </div>
                    </div>
                    <h3>Followers {state.followers}</h3>
                </div>
            </div>
        </>
    );
};
