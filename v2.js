$(window).load(function() {



	//First, set which image we will be opperating on
	var oppImage = $('#annotationImage').find('img.annotatableImage');
	//WE FIRST HAVE TO FIND HOW OFFSET AN ITEM IS FROM THE TOP-LEFT CORNER
	var parentOffset = oppImage.position(); //Find how the element is offset
	//dealing with resizing the screen
	$(window).resize(function() {
		redrawAnnots(); //redraw all annotations as the window gets resized
	});

//Make a nice crosshair for our users, to help them work out what's going on
	oppImage.css('cursor', 'crosshair');


	//Creating an Annotation object and array for jQuery use

	function Annotation(locX, locY, display_id) {
		return {
			locX: locX,
			locY: locY,
			display_id: display_id
		}
	}

	function Comment(f_name, l_name, photo, timestamp, comment, display_id) {
		return {
			f_name: f_name,
			l_name: l_name,
			photo: photo,
			timestamp: timestamp,
			comment: comment,
			display_id: display_id
		}
	}
	var Annotations = [];
	var Comments = [];
	var imageWidth = oppImage.width();
	var imageHeight = oppImage.height();
	var f_name = null;
	var l_name = null;
	var timestamp = null;
	var comment = null;
	var annotationID = null;
	//X and Y Loc Variables for passing to PHP script
	var locX = null;
	var locY = null;
	//IDs for client-side use
	//Worst. Security. Ever. Redo this later using a php web service (send everything to AJAX and let it sent the info back in JSON) bit.ly/17OF9CN
	var display_id = parseInt($("#displayID").val()) + 1;
	var f_name = document.getElementById('f_name').value;
	var l_name = document.getElementById('l_name').value;
	var userPhoto = document.getElementById('photo').value;
	var imageID = document.getElementById('imageID').value;
	var this_user_ID = document.getElementById('user_id').value;

	function redrawAnnots() {
		$('#annotationImage').find('.annotation').remove();
		//Looping through the Array, adding in all the annotations where needed
		for (var i = 0; i < Annotations.length; i++) {
			var posX = Annotations[i].locX;
			var posY = Annotations[i].locY;
			var annotation_number = Annotations[i].display_id;
			//Send this info to addAnnot() and let it do it's work
			addAnnot(posX, posY, annotation_number);
		}
	};

	function addToDB(locX, locY, display_id, thecomment, annotID) {
		jQuery.ajax({
			type: "POST",
			url: "scripts/addannotation.php",
			data: {
				locX: locX,
				locY: locY,
				display_id: display_id,
			},
			success: function() {
				saveComment(thecomment, annotID);
			},
			cache: false,
			error: function(response) {
				alert("Annotation not sent");
			}
		});
	}

	function saveComment(thecomment, display_id) {
		jQuery.ajax({
			type: "POST",
			url: "scripts/addcomment.php",
			data: {
				thecomment: thecomment,
				display_id: display_id,
			},
			cache: false,
			error: function(response) {
				alert("Comment not saved");
			}
		});
	}
	//Pulls the JSON array object from the PHP file
	$.getJSON("scripts/getannotations.php", function(data) {
		//Loop through each object in the array
		//On each loop save the locX and locY values to variable and put them into the Annotations array
		$.each(data, function(i, value) {
			var locX = value.locX;
			var locY = value.locY;
			var display_id = value.display_id;
			Annotations.push(Annotation(locX, locY, display_id));
		});
		//Looping through the Array, adding in all the annotations where needed
		redrawAnnots();
	});
	//Pulls our comments from the PHP file
	$.getJSON("scripts/getcomments.php", function(data) {
		//Loop through each object in the array
		//On each loop save the values to variable and put them into the Comments array and display them
		$.each(data, function(i, value) {
			var f_name = value.f_name;
			var l_name = value.l_name;
			var photo = value.photo;
			var timestamp = value.timestamp;
			var comment = value.comment;
			var userID = value.userID;
			var annotationID = value.display_id;
			Comments.push(Comment(f_name, l_name, photo, timestamp, comment, annotationID));
			putComment(f_name, l_name, userID, photo, timestamp, comment, annotationID);
			$('.comment').timeago();
		});
	});
	//Firstly, prevent people dragging images because it messes stuff up
	$('img').on('dragstart', function(e) {
		e.preventDefault();
	});
	oppImage.click(findClick); //dat traversal

	function findClick(e) {
		e.preventDefault;
		var clickDistanceFromSideOfImage = e.pageX - $(this).position().left; //Find how far away from the side of the image you clicked
		var locX = (clickDistanceFromSideOfImage / imageWidth); //Turn this information into a tiny float that can be used to make everything responsive
		var clickDistanceFromTopOfImage = e.pageY - $(this).position().top; //Find how far away from the top of the image you clicked
		var locY = (clickDistanceFromTopOfImage / imageHeight); //Turn this information into a tiny float that can be used to make everything responsive
		Annotations.push(Annotation(locX, locY, display_id));
		addCommentandDB(display_id, locX, locY);
		//bit.ly/16k6wqr
	} //closing brace for findClick()
	//Place the annotation image onto the element

	function addAnnot(x, y, display_id) {
		imageWidth = oppImage.width();
		imageHeight = oppImage.height();

		var outlocX = x * imageWidth + oppImage.position().left + "px";
		var outlocY = y * imageHeight + oppImage.position().top + "px";
		var positionElement = '<span class="blackCircle annotation" data-annotID="' + display_id + '" style="left: ' + outlocX + '; top: ' + outlocY + '; position: absolute; ">' + display_id + '</span>';
		$('#annotationImage').append(positionElement);
	}

	function putComment(f_name, l_name, userID, photo, timestamp, comment, comment_number) {
		var closeButton = " ";
		if (userID == this_user_ID) {
			closeButton = "<button class=\"close\" >&times;</button>";
		}
		var comment = '<div class="media comment" data-annotid="' + comment_number + '" data-userid="' + userID + '"><span class="badge badge-inverse pull-left">' + comment_number + '</span><a class="pull-left" href="#"><img class="media-object img-circle" src="' + photo + '" height="36" width="36">' + '</a>' + '<div class="media-body">' + '<p class="media-heading"><strong>' + f_name + ' ' + l_name + ' </strong>' + '<time class="timeago muted" datetime="' + timestamp + '">' + timestamp + '</time></p>' + closeButton + '<p>' + comment + '</p>' + '</div>' + '</div>';
		//These two lines just hide the bit of text saying there are no comments
		var nocomments = document.getElementById('nocomments');
		nocomments.style.display = 'none';
		$('#commentsDiv').append(comment);
	}

	function addCommentandDB(annotID, locX, locY) {
		var comment = null;
		bootbox.prompt("What is your comment?", function(result) {
			if (result === null) {
				$("#annotationImage").find("[data-annotID='" + annotID + "']").remove();
			} else {
				var thecomment = result;
				var comment = '<div class="media comment" data-annotid="' + annotID + '"><span class="badge badge-inverse pull-left">' + annotID + '</span><a class="pull-left" href="#">' + '<img class="media-object img-circle" src="' + userPhoto + '" height="36" width="36">' + '</a>' + '<div class="media-body">' + '<p class="media-heading"><strong>' + f_name + ' ' + l_name + '</strong><button class=\"close\">&times;</button><p>' + result + '</p>' + '</div>' + '</div>';
				//These two lines just hide the bit of text saying there are no comments
				var nocomments = document.getElementById('nocomments');
				nocomments.style.display = 'none';
				$('#commentsDiv').append(comment);
				addAnnot(locX, locY, display_id);
				addToDB(locX, locY, display_id, thecomment, annotID);
				//saveComment(thecomment, annotID);
				display_id = display_id + 1;
			}
		});
	}
	//To delete a comment, a user clicks on the .close button on the comment. Time to make this work.
	$('#commentsDiv').on('click', '.close', function() {
		var commentDivID = $(this).closest('.comment');
		var commentID = commentDivID.data('annotid');
		console.log(commentID)
		commentDivID.remove(); //remove the comment from the DOM
		$('#annotationImage').find('*[data-annotID="' + commentID + '"]').remove(); //Remove the annotation from the DOM
		jQuery.ajax({
			type: "POST",
			url: "scripts/deletecomments.php",
			data: {
				annotID: commentID,
				imageID: imageID
			},
			cache: false,
			error: function(response) {
				alert("Delete from Database not successful");
			},
			success: function(response) {
				console.log(response);
			}
		});
	});


	//Add in the instruction tooltip
	oppImage.tooltip({
            placement: "top",
            title: "Click the image wherever you want to leave a comment."
        });

        oppImage.on('mouseout', function(){
        //console.log("hi");
	       oppImage.tooltip('destroy');

        });
        //Autoshowing the tooltip
        oppImage.tooltip('show');

});
