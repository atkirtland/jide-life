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
                        $("#start3DViewBtn").show();
                        $("#spotify-login-button").hide();
                        $("#fbBtn").hide();
                        console.log(response);
                        response.items.forEach(function(element) {
                            musicTopTracksPreviewList.push(element.preview_url);
                        }, this);
                    }
                });
              } 
    
              document.getElementById('spotify-login-button').addEventListener('click', function() {
    
                var client_id = '19708ad4732b4e458c565a7ef23a228c'; // Your client id
                var redirect_uri = 'http://localhost:8000/'; // Your redirect uri
    
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