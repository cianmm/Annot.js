// Set up JS object for each annot
function Annot(locX, locY, id) {
    this.locX = locX;
    this.locY = locY;
    this.id = id;
}

(function ( $ ) {
$.fn.annot = function (options) {

    var settings = $.extend({
      // defaults
      printNumbers: true,
      load: [],
      class: "annotjs"
    }, options)

    // let's try to use options to put annotsArray[] into the options.
    // if one is provided, we'll use it, otherwise we'll create our own empty one.

    var oppImage = $(this);
        oppImageParent = $(this).parent();

    // SET THE BASICS
    // display a crosshair on hover
    oppImage.css('cursor', 'crosshair');
    // disable dragging on the image
    oppImage.on('dragstart', function (e) {
        e.preventDefault();
    })
    // Some info we'll need
    var imageWidth = oppImage.width();
    var imageHeight = oppImage.height();

    // Create an array to hold our objects in
    var annotsArray = settings.load;

    // place preloaded annots if they exist
    if (annotsArray.length > 0)
    {
      for (var i = 0; i < annotsArray.length; i++) {
        placeAnnot(annotsArray[i]);
      };

    }

    //FUNCTIONALITY
    var createAnnot = function (e) {
        var imagePosition = $(e.currentTarget).position();
        var clickX = e.pageX - imagePosition.left;
        var locX = clickX / imageWidth;
        var clickY = e.pageY - imagePosition.top;
        var locY = clickY / imageHeight;
        var annot = new Annot(locX, locY, annotsArray.length + 1);
        annotsArray.push(annot);
        placeAnnot(annot);
    }

    function placeAnnot(annot) {
        var fromTop = annot.locY * imageHeight;
        var fromLeft = annot.locX * imageWidth;


        var annotToPlace = $('<span class=" ' + settings.class + '" data-annotID="' + annot.id +
            '" style="left: ' + fromLeft + 'px; top: ' + fromTop +
            'px; position: absolute; "></span>');


        if (settings.printNumbers)
        {
          console.log(annot.id);
          annotToPlace.append(annot.id);
        }

        oppImageParent.append(annotToPlace);
        return annot;
    }

    oppImage.on('click', createAnnot);
}
}( jQuery ));
