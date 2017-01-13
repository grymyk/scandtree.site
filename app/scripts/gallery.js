(function ($) {
    'use strict';

    let template;

    let serverUrl = 'https://expigrt.herokuapp.com';

//let socket = io.connect('http://localhost:5000');

    console.log('--- io --- \n', io.connect.toString() );

    let socket = io.connect(serverUrl);

    let templateUrl = serverUrl + '/templates/item.hbs';

    $.get(templateUrl, (data) => {
        template = Handlebars.compile(data);
    }, 'html')
        .done( () => {
            console.log('second success');
        })
        .fail( () => {
            console.log('error');
        })
        .always( () => {
            console.log('finished');
        });

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
})(jQuery);
