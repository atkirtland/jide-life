// DEBUG
// var musicTopTracksPreviewList = [
//   "https://p.scdn.co/mp3-preview/15729912cc1b9b35f445bdc532f319bf27018f88",
//   "https://p.scdn.co/mp3-preview/09bd57c50d11f18eb903306bf67a20636c6fb8f3",
//   "https://p.scdn.co/mp3-preview/359bea826416cf1183de2b520f5601823652d7a8",
//   "https://p.scdn.co/mp3-preview/405c17a11ee9996e40fa893a69b58f36f6d88eaf",
//   "https://p.scdn.co/mp3-preview/ec27294877a32a7f8d6365abb094dffca6d521f3",
//   "https://p.scdn.co/mp3-preview/9dfc6208af75d78aab536dcd1ab66d96b5075226",
//   "https://p.scdn.co/mp3-preview/4fd9ddf8d0898781a29468ccfecc9c50fab59624",
//   "https://p.scdn.co/mp3-preview/dcb37db358a1a291acfe3b9b6c1ff195038150d5",
//   "https://p.scdn.co/mp3-preview/08cf29c3b6a87d944ec505814ceae2abd286ef36",
//   "https://p.scdn.co/mp3-preview/62b842daafa64f2bc6bd8d33b35dc2933727896b",
//   "https://p.scdn.co/mp3-preview/7f1dc0e2f56c946849ac2e61dfa1ce827fb8dc70",
//   "https://p.scdn.co/mp3-preview/5081ad81b17f67dfdd89593389bc95df49171632",
//   "https://p.scdn.co/mp3-preview/79471037420eefecf370a7d34236c33f45911163",
//   "https://p.scdn.co/mp3-preview/1077adefce73823fca883bae7f2a621b7d07c87d",
//   "https://p.scdn.co/mp3-preview/7041a18f41e741289ac13e85439f245fd9e30051",
//   "https://p.scdn.co/mp3-preview/9a3ee9186f767254aa7a5d8c9897e4ffa300945c",
//   "https://p.scdn.co/mp3-preview/173de2dea5dd26b7fdacec11d475b1a0e2d7d52c",
//   "https://p.scdn.co/mp3-preview/0fbe5f54892ab824fb4226e0f3150d259e64a477",
//   "https://p.scdn.co/mp3-preview/5138e298800afffb22a5ba2760cdf7330ed0133c",
//   "https://p.scdn.co/mp3-preview/999b2962c930d4754ac3a4b5e0fe5e87d7e6f0b7"
// ];
var musicTopTracksPreviewList = [];
(function() {
    
            var stateKey = 'spotify_auth_state';
    
            /**
             * Obtains parameters from the hash of the URL
             * @return Object
             */
            function getHashParams() {
              var hashParams = {};
              var e, r = /([^&;=]+)=?([^&;]*)/g,
                  q = window.location.hash.substring(1);
              while ( e = r.exec(q)) {
                 hashParams[e[1]] = decodeURIComponent(e[2]);
              }
              return hashParams;
            }
    
            /**
             * Generates a random string containing numbers and letters
             * @param  {number} length The length of the string
             * @return {string} The generated string
             */
            function generateRandomString(length) {
              var text = '';
              var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
              for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
              }
              return text;
            };
    
    
            var params = getHashParams();
    
            var access_token = params.access_token,
                state = params.state,
                storedState = localStorage.getItem(stateKey);
    
            if (access_token && (state == null || state !== storedState)) {
              alert('There was an error during the authentication');
            } else {
              localStorage.removeItem(stateKey);
              if (access_token) {
                $.ajax({
                    url: 'https://api.spotify.com/v1/me/top/tracks',
                    headers: {
                      'Authorization': 'Bearer ' + access_token
                    },
                    success: function(response) {
                        $("#fbBtn").show();
                        $("#spotify-login-button").hide();
                        console.log(response);
                        response.items.forEach(function(element) {
                            musicTopTracksPreviewList.push(element.preview_url);
                        }, this);
                    }
                });
              } 
    
              document.getElementById('spotify-login-button').addEventListener('click', function() {
    
                var client_id = '19708ad4732b4e458c565a7ef23a228c'; // Your client id
                var redirect_uri = window.location.href; // Your redirect uri
    
                var state = generateRandomString(16);
    
                localStorage.setItem(stateKey, state);
                var scope = 'user-read-private user-read-email user-top-read';
    
                var url = 'https://accounts.spotify.com/authorize';
                url += '?response_type=token';
                url += '&client_id=' + encodeURIComponent(client_id);
                url += '&scope=' + encodeURIComponent(scope);
                url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
                url += '&state=' + encodeURIComponent(state);
    
                window.location = url;
              }, false);
            }
          })();
