
// function myFunction() {
//     location.replace("register.html")
//   }


// sticky header js //

// $(window).scroll(function(){
//   if($(this).scrollTop() > 100){
//       $('header').addClass('sticky')
//   } else{
//       $('header').removeClass('sticky')
//   }
// });


// function imageData(url) {
//   const originalUrl = url || '';
//   return {
//     previewPhoto: originalUrl,
//     fileName: null,
//     emptyText: originalUrl ? 'No new file chosen' : 'No file chosen',
//     updatePreview($refs) {
//       var reader,
//           files = $refs.input.files;
//       reader = new FileReader();
//       reader.onload = (e) => {
//         this.previewPhoto = e.target.result;
//         this.fileName = files[0].name;
//       };
//       reader.readAsDataURL(files[0]);
//     },
//     clearPreview($refs) {
//       $refs.input.value = null;
//       this.previewPhoto = originalUrl;
//       this.fileName = false;
//     }
//   };
// }




// $('.owl-carousel').owlCarousel({
//   loop:false,
//   margin:10,
//   nav:true,
//   autoplay:true,
//   smartspeed: 2000,
//   responsive:{
//       0:{
//           items:1
//       },
//       600:{
//           items:2
//       },
//       1000:{
//           items:3
//       }
//   }
// })




// listing page search dropdown //
// $(".default_option").click(function(){
// 	$(".search_dropdown ul").addClass("active");
//   });
  
//   $(".search_dropdown ul li").click(function(){
// 	var text = $(this).text();
// 	$(".default_option").text(text);
// 	$(".search_dropdown ul").removeClass("active");
//   });


