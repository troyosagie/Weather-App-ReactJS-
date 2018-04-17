import React, { Component } from 'react';
import Switch from "react-switch";

import backArrow from '../../assets/icons/back.svg';
import API_KEY from '../../api-key';
import './Temperature.css';

class Temperature extends Component {
	state = { temperature: '', forecast: '', checked: false }

	componentDidMount() {
		this.fetchData();
	}

	fetchData = () => {
		if (sessionStorage.data){
			const data = JSON.parse(sessionStorage.data);
			data.type === 'city' ? this.fetchByCity(data.city) :
				this.fetchByCoordinates(data.coordinates);
		} else {
			this.props.history.replace('/');
		}
	}

	fetchByCity = (city) => {
		const unit = this.state.checked ? 'imperial' : 'metric';
		const temperatureRequest = fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}&units=${unit}`);
		const forecastRequest = fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${API_KEY}&units=${unit}`);
		this.temperatureFetched(temperatureRequest);
		this.forecastFetched(forecastRequest);
	}
	fetchByCoordinates = (coord) => {
		const unit = this.state.checked ? 'imperial' : 'metric';
		const temperatureRequest = fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&APPID=${API_KEY}&units=${unit}`);
		const forecastRequest = fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&APPID=${API_KEY}&units=${unit}`);
		this.temperatureFetched(temperatureRequest);
		this.forecastFetched(forecastRequest);
	}

	temperatureFetched = (request) => {
		request
			.then(res => res.json())
			.then(res => {
				sessionStorage.temperature = JSON.stringify(res);
				this.setState({ temperature: res });
			});
	}

	forecastFetched = (request) => {
		request
			.then(res => res.json())
			.then(res => {
				sessionStorage.forecast = JSON.stringify(res);
				this.setState({ forecast: res });
			});
	}

	renderLoadingMessage = () => (
		<div className="loading">
			<p>Loading</p>
		</div>
	)

	goBack = () => { this.props.history.replace('/'); }

	handleChange = () => {
		this.setState({ checked: !this.state.checked }, () => {
			this.fetchData();
		});
	}

	days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	months = ['January',
						'February', 
						'March', 
						'April', 
						'May', 
						'June', 
						'July', 
						'August', 
						'September', 
						'October',
						'November',
						'December'
					]

	renderContent = () => {
		if (this.state.temperature.cod == 200 && this.state.forecast.cod == 200){
			const { temperature: { name: cityName, dt, weather, main }, forecast } = this.state;
			const date = new Date(dt * 1000);
			const currentDate = date.getDate();
			const dateText = (currentDate === 1 && '1st') || (currentDate === 2 && '2nd') || (currentDate === 3 && '3rd') || (currentDate+'th');
			let dateIteration = forecast.list[0].dt_txt.split(' ')[0];
			const forecastArray = forecast.list.filter((temp) => {
				const newDate = temp.dt_txt.split(' ')[0];
				if (dateIteration !== newDate){
					dateIteration = temp.dt_txt.split(' ')[0];
					return true;
				}
				return false;
			});
			return (
				<div className="Temperature">
					<div className="header">
						<img className="back-arrow" alt="back arrow" onClick={this.goBack} src={backArrow} />
						<p className="city-name">{cityName}</p>
						<Switch
							offColor="#fff"
							onColor="#fff"
							offHandleColor="#999"
							onHandleColor="#999"
							uncheckedIcon={<span className="units">&deg;F</span>}
							checkedIcon={<span className="units">&deg;C</span>}
							height={15}
							className="switch"
							onChange={this.handleChange}
							checked={this.state.checked}
						/>
					</div>
					<div className="body">
						<p className="date-para">{this.days[date.getDay()]}, {this.months[date.getMonth()]} {dateText} {date.getFullYear()}</p>
						<p className="main-text">{weather[0].main}</p>
						<div className="todays-temp">
							<p className="main">{main.temp}&deg;{this.state.checked ? 'F' : 'C'}</p>
							<i className={`weather-icon wi wi-owm-${weather[0].id}`} />
							<div className="whole-day">
								<p><span className="day">Morning</span>{forecast.list[0].main.temp}&deg;{this.state.checked ? 'F' : 'C'}</p>
								<p><span className="day">Day</span>{forecast.list[1].main.temp}&deg;{this.state.checked ? 'F' : 'C'}</p>
								<p><span className="day">Evening</span>{forecast.list[3].main.temp}&deg;{this.state.checked ? 'F' : 'C'}</p>
								<p><span className="day">Night</span>{forecast.list[5].main.temp}&deg;{this.state.checked ? 'F' : 'C'}</p>
							</div>
						</div>
						<div className="forecast">
							{
								forecastArray.map(temp => (
									<div key={temp.dt_txt} className="forecast-day">
										<p>{this.days[(new Date(temp.dt_txt)).getDay()]}</p>
										<i className={`wi wi-owm-${temp.weather[0].id}`}/>
										<p>{temp.main.temp}&deg;{this.state.checked ? 'F' : 'C'}</p>
									</div>
								))
							}
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="loading">
					<p>{this.state.temperature.message}</p>
				</div>
				);
		}
	}

	render() {
		return this.state.temperature && this.state.forecast ?
			this.renderContent() :
			this.renderLoadingMessage();
	}
}

export default Temperature;
