(function($, Drupal, drupalSettings){
    console.log('#1');
    $(document).ready(function() {
        console.log('custom-js.js hihi > ');

        $('#report-view-slick-lightbox').slickLightbox();


        // $("#edit-details").click(function(){
        //     if($(this).attr('open') === undefined){
        //         // open
        //         $('input[name="is_open"]').val("1")
        //     }else{
        //         // close
        //         $('input[name="is_open"]').val("0")
        //     }
        // });
    });
})(jQuery, Drupal, drupalSettings);