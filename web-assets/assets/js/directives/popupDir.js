/* Menu Pop-up Directive
 ===========================================================================================
 ===========================================================================================*/

 scsFamilyApp.directive('popup', [ function () {
	return {
		restrict: 'A',
		link: function (scope, elem) {
            $('.fact__assets-info-link').click(function(e){
                 e.preventDefault();

                $('.fact__assets-desc-cont').css({'left': '-130%', 'display': 'none'});
                
                var $thisID = $(this).attr('id'),
                    $thisTargetID = $thisID.replace('fact-assets-info-', 'fact-asset-desc-');

                $('#' + $thisTargetID).css({'left': '0', 'display': 'block'});
            });

            $('.fact__assets-close-link').click(function(e){
                e.preventDefault();
                $('.fact__assets-desc-cont').css({'left': '-130%', 'display': 'none'});
            });
		}
	};
} ]);