var newsList = [];
if (userPersonalInfo.age_range != null) {
    var averageAge = userPersonalInfo.age_range.max + userPersonalInfo.age_range.min;
    averageAge = averageAge / 2;
    // Built by LucyBot. www.lucybot.com
    var year = (new Date()).getFullYear() - averageAge / 3;
    var url = "https://api.nytimes.com/svc/archive/v1/"+year+"/1.json";
    url += '?' + $.param({
    'api-key': "b23a3efcd74a438c9ab4d33359cf59f1"
    });
    var success = function(result) {
        console.log(result);
        newsList.push(result);
        year -=  averageAge / 3;
        
        var url = "https://api.nytimes.com/svc/archive/v1/"+year+"/1.json"; 
        url += '?' + $.param({
            'api-key': "b23a3efcd74a438c9ab4d33359cf59f1"
        });
        $.ajax({
            url: url,
            method: 'GET',
        }).done(success).fail(function(err) {
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
