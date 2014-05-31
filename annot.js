$.fn.annot = function () {

    var oppImage = $(this);
    var oppImageParent = $(this).parent();

    // SET THE BASICS
    // display a crosshair on hover
	  oppImage.css('cursor', 'crosshair');
    // disable dragging on the image
    oppImage.on('dragstart', function(e){
      e.preventDefault();
    })
    // Some info we'll need
    var imageWidth = oppImage.width();
    var imageHeight = oppImage.height();

    // Set up JS object for each annot
    function Annot(locX, locY, id) {
      this.locX = locX;
      this.locY = locY;
      this.id = id;
    }

    // Create an array to hold our objects in
    var annotsArray = [];

    //FUNCTIONALITY
    var createAnnot = function(e) {
      var imagePosition = $(e.currentTarget).position();
      var clickX = e.pageX - imagePosition.left;
      var locX = clickX/imageWidth;
      var clickY = e.pageY - imagePosition.top;
      var locY = clickY/imageHeight;
      var annot = new Annot(locX, locY, annotsArray.length + 1);
      annotsArray.push(annot);
      placeAnnot(annot);
    }

    function placeAnnot(annot) {
      var fromTop = annot.locY * imageHeight;
      var fromLeft = annot.locX * imageWidth;
      console.log(annotsArray);
		  var annot = $('<span class="annotjs" data-annotID="' + annot.id +
                  '" style="left: ' + fromLeft + 'px; top: ' + fromTop +
                  'px; position: absolute; ">' + annot.id + '</span>');
      oppImageParent.append(annot);
    }

    oppImage.on('click', createAnnot);


}
