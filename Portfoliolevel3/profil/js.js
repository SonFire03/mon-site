$(document).ready(function() {
    jQuery(function($){
    //Lorsque vous cliquez sur un lien de la classe poplight
    $('a.poplight').on('click', function() {
      var popID = $(this).data('rel'); //Trouver la pop-up correspondante
      var popWidth = $(this).data('width'); //Trouver la largeur
      //Faire apparaitre la pop-up et ajouter le bouton de fermeture
      $('#' + popID).fadeIn().css({ 'width': popWidth}).prepend('<a href="#" class="close"><img src="static/img/close-icon.png" class="btn_close" title="Close Window" alt="Close" /></a>');
      //Récupération du margin, qui permettra de centrer la fenêtre - on ajuste de 80px en conformité avec le CSS
      var popMargTop = ($('#' + popID).height() + 80) / 2;
      var popMargLeft = ($('#' + popID).width() + 80) / 2;
      //Apply Margin to Popup
      $('#' + popID).css({ 
        'margin-top' : -popMargTop,
        'margin-left' : -popMargLeft
      });
      //Apparition du fond - .css({'filter' : 'alpha(opacity=80)'}) pour corriger les bogues d'anciennes versions de IE
      $('body').append('<div id="fade"></div>');
      $('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn();
      
      return false;
    });
    //Close Popups and Fade Layer
    $('body').on('click', 'a.close, #fade', function() { //Au clic sur le body...
      $('#fade , .popup_block').fadeOut(function() {
        $('#fade, a.close').remove();  
    }); //...ils disparaissent ensemble
      return false;
    });
  });
});

function dropdown(id) {
    document.getElementById(id).classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}