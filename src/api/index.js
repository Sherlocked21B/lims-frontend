import axios from 'axios';

export default axios.create({
	baseURL:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:5000'
			: 'https://lims.onrender.com/',
	headers: {
		Authorization: 'Bearer ' + localStorage.getItem('token'),
	},
});
