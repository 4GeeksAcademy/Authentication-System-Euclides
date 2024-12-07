import toast, { Toaster } from 'react-hot-toast';



const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: null,
			token: localStorage.getItem("token") || null,
			type_user: localStorage.getItem("type_user") || null,

			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			properties: [],
			filtros: null
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},


			registro: async (first_name, last_name, email, type_user, password) => {
				// Enviando datos al backend para el registro
				const resp = await fetch(process.env.BACKEND_URL + "api/register", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						first_name: first_name,
						last_name: last_name,
						email: email,
						type_user: type_user,
						password: password
					})
				});

				const data = await resp.json();

				// Manejo de la respuesta
				if (resp.ok) {

					localStorage.setItem("token", data.token);
					localStorage.setItem("type_user", data.user.type_user);
					setStore({
						token: data.token,
						user: data.user,
						type_user: data.user.type_user

					});

					toast.success("Registro exitoso 🎉");
				} else {
					toast.error(data.msg || "Registro fallido 🙅🏽");
				}
			},


			login: async (email, password, type_user) => {
				try {
				// fetching data from the backend 
				const resp = await fetch(process.env.BACKEND_URL + "api/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: email,
						password: password,
						type_user: type_user
					})
				});

				const data = await resp.json();

				localStorage.setItem("token", data.token);
				localStorage.setItem("type_user", data.user.type_user);


				setStore({
					token: data.token,
					user: data.user,
					type_user: data.user.type_user

				});

				return true
			} catch (error) {
				console.log(error)
				return false
			}

			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},

			logout: () => {
				localStorage.removeItem("token");
				setStore({
					token: null,
					user: null,
				});
				toast.success("Logout success 🎉")
			},
		}
	};
};

export default getState;