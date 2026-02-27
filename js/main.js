(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('bg-primary shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('bg-primary shadow-sm').css('top', '-150px');
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 1000,
        dots: true,
        loop: true,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });

    // Lead magnet modal (only once per browser session)
    var leadMagnetModal = document.getElementById('leadMagnetModal');
    var canUseSessionStorage = false;

    try {
        canUseSessionStorage = !!window.sessionStorage;
    } catch (e) {
        canUseSessionStorage = false;
    }

    var hasSeenLeadMagnet = canUseSessionStorage && sessionStorage.getItem('leadMagnetShown');

    if (leadMagnetModal && window.bootstrap && !hasSeenLeadMagnet) {
        var leadMagnetInstance = new bootstrap.Modal(leadMagnetModal);

        setTimeout(function () {
            leadMagnetInstance.show();
            if (canUseSessionStorage) {
                sessionStorage.setItem('leadMagnetShown', 'true');
            }
        }, 8000);

        leadMagnetModal.addEventListener('hidden.bs.modal', function () {
            if (canUseSessionStorage) {
                sessionStorage.setItem('leadMagnetShown', 'true');
            }
        });
    }
    
})(jQuery);

