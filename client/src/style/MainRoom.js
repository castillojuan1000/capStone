import styled from 'styled-components'

export const MainRoom = styled.div`
	height: 90vh;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	transition: all 1s;
	background: ${props =>
        `linear-gradient(160deg, ${props.color} 15%, rgba(0,0,0, 0.9) 70%)`};
	h1,
	h3,
	h5 {
		color: rgba(255, 255, 255, 0.75);
		line-height: 1em;
		margin: 0 1rem;
		font-size: 1rem;
		color: white;
		text-transform: capitalize;
		font-weight: 200;
	}
	h1 {
		margin: 2rem;
		font-size: 2rem;
		font-weight: 500;
	}
	.main_room_hero {
		display: flex;
		justify-content: space-between;
	}
	.song-block {
		width: 100%;
	}
	.roomInfo {
		display: flex;
		align-items: flex-start;
	}
	.song-image {
		width: 60px;
		height: 60px;
		z-index: 2;
		img {
			border-radius: 5px;
			max-width: 100%;
			max-height: 100%;
		}
	}
	.room-host {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		.host-left-section {
			padding-top: 5%;
			height: 100%;
			.host-banner {
				height: 18em;
				width: 18em;
				background-repeat: no-repeat;
				background-size: cover;
				border-radius: 50%;
			}
		}
		.host-top-section {
			width: 30vw;
			height: 90vh;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			background: rgba(0, 0, 0, 0);
		}
		.host-left-section {
			width: 100%;
			width: 30vw;
			height: 50%;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}
		.host-description {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.host-buttons {
			width: 70%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			padding-right: 10%;
			padding-top: 5%;
			padding-left: 10%;
			align-items: center;
			flex-wrap: nowrap;
		}
	}

	.room-stats {
		display: flex;
		border-radius: 5px;
		flex-direction: column;
		align-items: center;
		width: 50%;
		transition: all 2s ease-in;
		.room-actions {
			margin: 5px 10px;
			display: flex;
			justify-content: center;
			width: 100%;
			button {
				color: white;
			}
		}
		.room-songs {
			flex-grow: 2;
			width: 100%;
			min-height: 50%;
			overflow-x: hidden;
			display: none;
			flex-direction: column;
			justify-content: flex-start;
			align-items: flex-start;
			margin: 2em 0;
			background-color: rgba(0, 0, 0, 0.5);
			.room-song {
				background-color: rgba(0, 0, 0, 0.5);
				cursor: pointer;
				display: flex;
				margin: 1px 0;
				width: 100%;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #333;
				&.active {
					background-color: ${({ color }) => (color ? color : 'red')};
				}
				.song-name {
					flex-grow: 2;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					h3 {
						font-size: 1rem;
						font-weight: 200;
						&.name {
							width: fit-content;
							font-size: 1.5rem;
							font-weight: 300;
						}
					}
					a {
						color: inherit;
					}
				}
			}
		}
		.active {
			display: flex;
		}
	}

	.likes-container {
		height: 40%;
		width: 40%;
		margin: auto;
	}
`;