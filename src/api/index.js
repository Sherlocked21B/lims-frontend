import axios from "axios";

export default axios.create({
	baseURL: "https://limsnepal.herokuapp.com/",
	headers: {
		Authorization: "Bearer " + localStorage.getItem("token"),
	},
});
