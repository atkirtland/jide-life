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
var newsList = [];

function checkLoginState(){
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {

          
          FB.api(
            '/me/photos',
            'GET',
            {"fields":"images,updated_time", "type":"uploaded"},
            function(response) {
                response.data.forEach(function(element) {
                    arrOfWebpImages.push(element);
                }, this);
            }
          );
          FB.api(
            '/me/photos',
            'GET',
            {"fields":"images,updated_time", "type":"tagged"},
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
                console.log('userPersonalInfo')
                console.log(userPersonalInfo);

                
                    var averageAge = 40;
                    if (userPersonalInfo.age_range != null) {
                        if (userPersonalInfo.age_range.min == null) averageAge = userPersonalInfo.age_range.max;
                        if (userPersonalInfo.age_range.max == null) averageAge = userPersonalInfo.age_range.min;
                        averageAge = (userPersonalInfo.age_range.max + userPersonalInfo.age_range.min) / 2;
                    }
                    // Built by LucyBot. www.lucybot.com
                    var year = (new Date()).getFullYear() - Math.round(averageAge / 3);
                    var url = "https://api.nytimes.com/svc/archive/v1/"+year+"/1.json";
                    url += '?' + $.param({
                    'api-key': "b23a3efcd74a438c9ab4d33359cf59f1"
                    });
                    var success = function(result) {
                        console.log(result);
                        newsList.push(result);
                        year -= Math.round(averageAge / 3);
                        var url = "https://api.nytimes.com/svc/archive/v1/"+year+"/1.json"; 
                        url += '?' + $.param({
                            'api-key': "b23a3efcd74a438c9ab4d33359cf59f1"
                        });

                        $.ajax({
                            url: url,
                            method: 'GET',
                        }).done((result)=>{
                          newsList.push(result);
                          console.log(result);
                          $("#fbBtn").hide();
                          $("#spotify-login-button").hide();
                          $("#start3DViewBtn").show();
                          console.log(arrOfWebpImages);
                        }).fail(function(err) {
                            throw err;
                        });
                    };
                    $.ajax({
                        url: url,
                        method: 'GET',
                    }).done(success).fail(function(err) {
                        throw err;
                    });
            }
          );


        }
        else {
          FB.login();
        }
      });
}
