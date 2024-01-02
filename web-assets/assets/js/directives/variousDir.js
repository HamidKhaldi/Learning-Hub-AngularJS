/* clicked and hover Directive
 ===========================================================================================
 ===========================================================================================*/

scsFamilyApp.directive('scroll', [ function () {
	return {
		restrict: 'A',
		link: function (scope, elem) {

            $('.scs__nav-list--item').removeClass('yellow-bg');
            $('.scs__nav-list--item').eq(0).addClass('yellow-bg');
            
            $('.scs__nav-list--link').click(function(e){
               var  thisLink = $(this),
                    thisListItem = thisLink.parent().eq(0);
                    // thisTarget = thisLink.attr('href');

                $('.scs__nav-list--item').removeClass('yellow-bg');
                $(thisListItem).addClass('yellow-bg');

                // if($(this).text() !== 'Home' && $(this).text() !== 'Quick Links'){                            
                //     $('#scs__main-wrapper').animate({
                //         scrollTop: $(thisTarget).offset().top
                //     }, 1000);
                //     // return false;               
                // } else {
                //     $('#scs__main-wrapper').animate({
                //         scrollTop: 0
                //     }, 1000);
                // }
            });

            $('.scs__logo-link').click(function(){
                $('.scs__nav-list--item').removeClass('yellow-bg');
                $('.scs__nav-list--item').eq(0).addClass('yellow-bg');
            });
            
        }
	};
} ]);

scsFamilyApp.directive('personaliseNews', [ function () {
	return {
		restrict: 'A',
		link: function (scope, elem) {
            
            $('#scs__personalise-news').click(function(){
                //e.preventDefault();
                console.log('clicked to open');
                console.log('section ', $('.scs__personalise-section').eq(0));
                $('.scs__personalise-section').removeClass('hide-assets');
            });
            
            $('.scs__personalise-close-link').click(function(){
                console.log('clicked 5667');
                $('.scs__personalise-section').addClass('hide-assets');
            });
            
        }
	};
} ]);

// scsFamilyApp.directive('search', [ function () {
// 	return {
// 		restrict: 'A',
// 		link: function (scope, elem) {
            
//             $('.scs__search-link').click(function(){
//                 //e.preventDefault();
//                 console.log('clicked to open');
//                 $('.scs__search-cont').toggleClass('hide-assets');
//             });
            
//             $('.scs__search-close-link').click(function(){
//                 $('.scs__search-cont').removeClass('hide-assets');
//             });
            
//         }
// 	};
// } ]);



