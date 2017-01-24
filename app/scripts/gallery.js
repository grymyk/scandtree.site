(function ($, io, Handlebars, moment) {
    'use strict';

    let serverUrl = 'https://expigrt.herokuapp.com';

    let socket = io.connect(serverUrl);

    let photoSource = $('#photo-template').html();
    let statsSourse = $('#stats-template').html();

    let photoTemplate = Handlebars.compile(photoSource);
    let statsTemplate = Handlebars.compile(statsSource);

    Handlebars.registerHelper('human_time', (timestamp) => {
        return moment.unix(timestamp).fromNow();
    });

    socket.on('fotos', (data) => {
        let galleryHolder = $('#gallery').find('.gallery');

        let html = photoTemplate(data);

        appendData(galleryHolder, data);

        /*galleryHolder
            .empty()
            .append( $(html) )
            .fadeIn('slow');*/
    });

    socket.on('stats', (data) => {
        let statsHolder = $('ig_stats');

        let html = statsTemplate(data);

        appendData(statsHolder, html);

        /*statsHolder
            .empty()
            .append( $(html) )
            .fadeIn('slow');*/
    });

    function appendData(holder, data) {
        $(html).hide();

        holder
            .empty()
            .append( $(data) )
            .fadeIn('slow');
    }

})(jQuery, io, Handlebars, moment);
