/* clicked and hover Directive
 ===========================================================================================
 ===========================================================================================*/

scsFamilyApp.directive('cardheight', [ function () {
	return {
		restrict: 'A',
		link: function (scope, elem) {
         //console.log("card height dir called");
            var maxHeight = 0;

            setTimeout(function() {
               $(".card").each(function(){
                  if ($(this).height() > maxHeight) { 
                     maxHeight = $(this).height() + 10; 
                  }
               });

               //console.log("maxheight:: ", maxHeight);

               $(".card").height(maxHeight);
               $(".card-image").height(maxHeight);
               $(".scs__card-assoc-image").height(maxHeight);
               $(".scs__card-assoc-desc").height(maxHeight);
               
            }, 700);


            
        }
	};
} ]);


