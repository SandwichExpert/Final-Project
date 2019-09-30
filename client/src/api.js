import axios from "axios";

console.log(process.env.NODE_ENV);

const service = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "/api"
      : `http://${window.location.hostname}:2000/api`,

  withCredentials: true
});

const errHandler = err => {
  console.error(err);
  if (err.response && err.response.data) {
    console.error("API response", err.response.data);
    throw err.response.data.message;
  }
  throw err;
};

export default {
  service: service,

  // This method is synchronous and returns true or false
  // To know if the user is connected, we just check if we have a value for localStorage.getItem('user')
  isLoggedIn() {
    return localStorage.getItem("user") != null;
  },

  // This method returns the user from the localStorage
  // Be careful, the value is the one when the user logged in for the last time
  getLocalStorageUser() {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    user.password = undefined;
    return user;
  },

  // This method signs up and logs in the user
  signup(userInfo) {
    const formData = new FormData();
    const userInfoKeys = Object.keys(userInfo);
    userInfoKeys.forEach(key => {
      formData.append(`${key}`, userInfo[`${key}`]);
    });
    return service
      .post("/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        // If we have localStorage.getItem('user') saved, the application will consider we are loggedin
        localStorage.setItem("user", JSON.stringify(res.data));
        return res.data;
      })
      .catch(errHandler);
  },

  login(email, password) {
    return service
      .post("/login", {
        email,
        password
      })
      .then(res => {
        // If we have localStorage.getItem('user') saved, the application will consider we are loggedin
        localStorage.setItem("user", JSON.stringify(res.data));
        return res.data;
      })
      .catch(errHandler);
  },

  logout() {
    localStorage.removeItem("user");
    return service.get("/logout");
  },

  // API for users routes

  getUserInfo() {
    return service
      .get(`/users`)
      .then(res => res.data)
      .catch(errHandler);
  },

  deleteUser() {
    return service
      .delete("/users")
      .then(res => res.data)
      .catch(errHandler);
  },

  editUser(userInfo) {
    const formData = new FormData();
    const userInfoKeys = Object.keys(userInfo);
    console.log(userInfo,userInfoKeys)
    userInfoKeys.forEach(key => {
      formData.append(`${key}`, userInfo[`${key}`]);
    });
    return service
      .put("/users/edit", formData,{
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => res.data)
      .catch(errHandler);
  },

  addFriend(body) {
    const email = { email: body.email };
    return service
      .post("users/addFriend")
      .then(res => res.data)
      .catch(errHandler);
  },

  removeFriend(friendId) {
    return service
      .post(`users/removeFriend/${friendId}`)
      .then(res => res.data)
      .catch(errHandler);
  },

  // This is an example on how to use this method in a different file
  // api.getCountries().then(countries => { /* ... */ })

  getSecret() {
    return service
      .get("/secret")
      .then(res => res.data)
      .catch(errHandler);
  },

  addPicture(file) {
    const formData = new FormData();
    formData.append("picture", file);
    return service
      .post("/endpoint/to/add/a/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => res.data)
      .catch(errHandler);
  },

  getMeetUp(meetupId) {
    return service
      .get(`/meetups/one-meetup/${meetupId}`)
      .then(res => res.data)
      .catch(errHandler);
  },

  addMeetUp(uploadData) {
    return service
      .post("/meetups", uploadData)
      .then(res => res.data)
      .catch(errHandler);
  }

  // getAdmin(meetupAdmin){
  //   return service
  //     .get(`meetups/${meetupAdmin}`)
  //     .then(res => res.data)
  //     .catch(errHandler)
  // }
};
