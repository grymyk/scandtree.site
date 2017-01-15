(function ($, io, Handlebars, moment) {
    'use strict';

    let serverUrl = 'https://expigrt.herokuapp.com';

    let socket = io.connect(serverUrl);
    let source = $('#photo-template').html();
    let template = Handlebars.compile(source);

    Handlebars.registerHelper('human_time', (timestamp) => {
        return moment.unix(timestamp).fromNow();
    });

    socket.on('fotos', (data) => {
        console.log(data);

        let galleryHolder = $('#gallery').find('.gallery');

        let html = template(data);

        $(html).hide();

        galleryHolder
            .empty()
            .append( $(html) )
            .fadeIn('slow');

        //$(html).hide().insertBefore(galleryHolder).fadeIn('slow');
    });
})(jQuery, io, Handlebars, moment);
