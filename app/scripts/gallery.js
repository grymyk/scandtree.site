'use strict';

let template;

//let socket = io.connect('http://localhost:5000');
let socket = io.connect('https://expigrt.herokuapp.com');

$.get('/templates/item.hbs', (data) => {
    template = Handlebars.compile(data);
}, 'html');

Handlebars.registerHelper('human_time', (timestamp) => {
    return moment.unix(timestamp).fromNow();
});

socket.on('fotos', (data) => {
    console.log(data);

    let gallery_holder = $('#gallery').find('.gallery');

    let html = template(data);

    $(html).hide();

    gallery_holder
        .empty()
        .append( $(html) )
        .fadeIn('slow');

    //$(html).hide().insertBefore(gallery_holder).fadeIn('slow');
});
