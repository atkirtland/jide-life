window.fbAsyncInit = function() {
    FB.init({
      appId            : '184581268770743',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v2.10'
    });
    FB.AppEvents.logPageView();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

var arrOfWebpImages = [];
var userPersonalInfo;
function checkLoginState(){
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          $("#fbBtn").hide();
          FB.api(
            '/me/photos',
            'GET',
            {"fields":"webp_images,updated_time", "type":"uploaded"},
            function(response) {
                response.data.forEach(function(element) {
                    arrOfWebpImages.push(element);
                }, this);
            }
          );
          FB.api(
            '/me/photos',
            'GET',
            {"fields":"webp_images,updated_time", "type":"tagged"},
            function(response) {
                response.data.forEach(function(element) {
                    arrOfWebpImages.push(element);
                }, this);
            }
          );
          FB.api(
            '/me/',
            'GET',
            {"fields":"age_range,birthday,gender,hometown"},
            function(response) {
                userPersonalInfo = response;
            }
          );

          $("#spotify-login-button").show();
          console.log(response);
          console.log(arrOfWebpImages);
        }
        else {
          FB.login();
        }
      });
}