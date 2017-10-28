
  var typed3 = new Typed('#typed1', {
    strings: ['Memory flashback', 'Help people who are suffering from memory loss', 'Retrieve memories from Facebook photos', 'Retrieve memories from Favorite musics', 'Retrieve memories from newspapers'],
    typeSpeed: 60,
    backSpeed: 20,
    smartBackspace: true, // this is a default
    loop: true
  });

  $("#fbBtn").hide();
  $("#start3DViewBtn").hide();

  document.getElementById("start3DViewBtn").addEventListener("click", function(){
    $(".intro").hide();
  });