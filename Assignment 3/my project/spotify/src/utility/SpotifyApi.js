import Axios from "axios";

//get token   554 proxy
const getToken = async () => {
  const authOptions = {
    method: 'POST',
    url: 'https://cs-554-spotify-proxy.herokuapp.com/api/token',
    form: {
      　grant_type: 'client_credentials'
    },
    auth: {
      username: "1851476fc12846979c6f62ead0ddd2df",
      password: "e9b0102ffec240a29f9869e6e82f95ef"
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };
  
  const result = await Axios(authOptions);
  console.log(result);

  return result.data.access_token;   //
}

const Spotify_Instance = Axios.create();
Spotify_Instance.interceptors.request.use(async function (config) {
  const accessToken = await getToken();

  config.url = `https://cs-554-spotify-proxy.herokuapp.com/v1/${config.url}`;
  config.headers = {
    Authorization: `Bearer ${accessToken}`
  }
  
  console.log("Got access token");
  console.log(accessToken);

  return config;
});

export const searchForTracks = async trackName => {
  const url = `search?type=track&q=${trackName}`;      
  const httpResponse = await Spotify_Instance.get(url);

  const tracks = httpResponse.data.tracks.items;    

  console.log(tracks);

  return tracks;
};












// const Spotify_Instance = axios({
//   method: 'POST',
//   url: 'https://cs-554-spotify-proxy.herokuapp.com/api/token',
//   data: querystring.stringify({
//           grant_type: 'refresh_token',
//           refresh_token: refreshToken
//       }),
//   headers: {
//       'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
//       'Content-Type': 'application/x-www-form-urlencoded'
//   },
//   json: true
// })
// .then(response => {
//    console.log(response);
// });






