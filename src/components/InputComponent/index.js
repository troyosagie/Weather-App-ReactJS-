import React, { Component } from 'react';

import search from '../../assets/icons/search.svg';
import './InputComponent.css';

class InputComponent extends Component {
	state = {
		city: '',
	}

	_onSubmit = () => {
		const { city } = this.state;
		sessionStorage.data = JSON.stringify({ type: 'city', city });
		this.props.history.push('/temperature');
	}

	_onChange = (e) => { this.setState({ city: e.target.value }); }

	_onClick = (e) => {
		e.preventDefault();
		if (navigator)
			navigator.geolocation.getCurrentPosition((position) => {
				sessionStorage.data = JSON.stringify({
					type: 'coordinates',
					coordinates: {
						lon: position.coords.longitude,
						lat: position.coords.latitude,
					},
				});
				this.props.history.push('/temperature');
			});
		else
			alert("please enter the name of your city")
	}

	render() {
		return (
			<div className="InputComponent">
				<div className="input-holder">
					<form onSubmit={this._onSubmit}>
						<input placeholder="City" onChange={this._onChange}/>
					</form>
					<img alt="search icon" className="search-icon" src={search} />
				</div>
				<p>or</p>
				<p
					role="button"
					tabIndex={1}
					onClick={this._onClick}
					onKeyUp={this._onClick}
					className="current-position"
				>
					use my <span>current position</span>
				</p>
			</div>
		);
	}
}

export default InputComponent;
