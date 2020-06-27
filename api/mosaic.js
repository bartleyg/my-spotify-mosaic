const axios = require('axios');
const querystring = require('querystring');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;


module.exports = async (req, res) => {
  let songs = [];
  let personalToken = await getPersonalToken();
  let rpTracks = await getRecentlyPlayed(personalToken);
  for (const track of rpTracks.items) {
    songs.push({
      'image': track.track.album.images[0].url,
      'name': track.track.name,
      'uri': track.track.uri,
    });
  }
  res.send({songs});
}

function getPersonalToken() {
  const PERSONAL_TOKEN_URL = 'https://accounts.spotify.com/api/token';
  const personalTokenForm = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }
  const personalTokenOpts = {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
  }
  return axios.post(PERSONAL_TOKEN_URL, querystring.stringify(personalTokenForm), personalTokenOpts)
    .then(response => {
      if (response.statusText !== 'OK') {
        console.log(`ERROR ${personalTokenUrl}: ${response.status} ${response.statusText}`);
        if (response.data.error) {
          console.log(response.data.error);
        }
      } else {
        return response.data.access_token;
      }
    })
    .catch(error => console.log(`ERROR ${personalTokenUrl}: ${error}`));
}

function getRecentlyPlayed(token) {
  const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=50';
  const recentlyPlayedOpts = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }
  return axios.get(RECENTLY_PLAYED_URL, recentlyPlayedOpts)
    .then(response => {
      if (response.statusText !== 'OK') {
        console.log(`ERROR ${recentlyPlayedUrl}: ${response.status} ${response.statusText}`);
        if (response.data.error) {
          console.log(response.data.error);
        }
      } else {
        return response.data;
      }
    })
    .catch(error => console.log(`ERROR ${recentlyPlayedUrl}: ${error}`));
}
