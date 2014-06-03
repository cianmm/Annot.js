// Set up JS object for each annot
function Annot(locX, locY, id) {
    this.locX = locX;
    this.locY = locY;
    this.id = id;
}

(function ($) {
    $.fn.annot = function (options) {

        // SETUP
        var settings = $.extend({
            // defaults
            printID: true,
            load: [],
            class: "annotjs"
        }, options);

        // let's try to use options to put annotsArray[] into the options.
        // if one is provided, we'll use it, otherwise we'll create our own empty one.

        var oppImage = $(this);
        var oppImageParent = $(this).parent();
        var imagePosition = oppImage.offset();
        var oppImageParentPosition = oppImageParent.offset();

        // display a crosshair on hover
        oppImage.css('cursor', 'crosshair');
        // disable dragging on the image
        oppImage.on('dragstart', function (e) {
            e.preventDefault();
        });
        // Some info we'll need to calculate where to place annots
        var imageWidth = oppImage.width();
        var imageHeight = oppImage.height();

        // now we need to work out how much to offset the annotation by to keep
        // it centered on the crosshair. To do that, let's create an annotation
        // object, store the value we want and delete it. Damn this box is good

        var fakeAnnot = $('<span class="' + settings.class + '"</span>').hide().appendTo("body");
        var annotWidth = parseInt(fakeAnnot.css("width"), 10);
        var annotHeight = parseInt(fakeAnnot.css("height"))
        fakeAnnot.remove();


        // console.log("IMAGE");
        // console.log(" width = " + imageWidth);
        // console.log(" height = " + imageHeight);


        // Create an array to hold our objects in
        var annotsArray = settings.load;

        // place preloaded annots if they exist
        if (annotsArray.length > 0) {
            for (var i = 0; i < annotsArray.length; i++) {
                placeAnnot(annotsArray[i]);
            }

        }

        //FUNCTIONALITY
        var createAnnot = function (e) {
            var locX = (e.pageX - imagePosition.left) / imageWidth;
            var locY = (e.pageY - imagePosition.top) / imageHeight;

            // console.log("IMAGEPOSITION \n left = " + imagePosition.left +
            // " \n top = " + imagePosition.top)
            // console.log("MOUSECLICK \n x = " + e.pageX + " \n y = " + e.pageY)
            // console.log("CREATEANNOT \n x = " + locX + " \n y = " + locY)

            var annot = new Annot(locX, locY, annotsArray.length + 1);
            annotsArray.push(annot);
            placeAnnot(annot);
        };

        function placeAnnot(annot) {
            var outImagePosition = oppImage.position();
            var fromLeft = annot.locX * imageWidth - annotWidth/2;
            var fromTop = annot.locY * imageHeight - annotHeight/2;

            // console.log("PLACEANNOT \n x = " + fromLeft/imageWidth + " \n y = " + fromTop/imageHeight)
            var annotToPlace = $('<span class=" ' + settings.class +
              '" data-annotID="' + annot.id +
              '" style="left: ' + fromLeft + 'px; top: ' + fromTop +
              'px; position: absolute; "></span>');


            if (settings.printID) {
                annotToPlace.append(annot.id);
            }

            oppImageParent.append(annotToPlace);
            return annot;
        }

        oppImage.on('click', createAnnot);
    };

    return this;

}(jQuery));
