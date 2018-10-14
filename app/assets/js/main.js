'use strict';

$(document).ready(function() {

    /**
     * @set body width and height
     */
    function setBodyProps() {
        let setprops = () => {
            $('body').css({
                'width':window.innerWidth,
                'height':window.innerHeight
            });
        };

        setprops();
        $(window).on('resize', function() {
            setprops();
        });
    }

    /**
     * @return active burger menu
     */
    function BurgerMenu() {
        $('.burger_btn').on('click', function() {
            $(this).toggleClass('burger_active');
            $('.burger_menu').toggleClass('burger_menu_active');

            if($('.burger_menu').hasClass('burger_menu_active')) {
                $(document).mouseup(function (e){ // событие клика по веб-документу
                    e.stopPropagation();

                    if(e.target.className.indexOf('burger_btn')>-1) {
                        return;
                    }
                    var div = $(".burger_menu"); // тут указываем ID элемента
                    if (!div.is(e.target) // если клик был не по нашему блоку
                        && div.has(e.target).length === 0) { // и не по его дочерним элементам
                        $('.burger_btn').removeClass('burger_active');
                        div.removeClass('burger_menu_active');
                    }
                });
            }
        });
    }

    /**
     * @return filter
     */
    function FilterVideoImage(filter_link,filter_block) {
        function setFilt() {
            $(filter_link).hasClass('active') ? $(filter_link).removeClass('active') : false;
            $(this).toggleClass('active');

            let filteringItems = $('.item_block');
            let filterData = $(this).attr('data-filter').trim().toUpperCase();

            let onItem = (item,prop) => {
                switch(prop.toUpperCase()) {
                    case 'CLOSE':
                        item.removeClass('scale-1').addClass('scale-0');
                        break;
                    case 'OPEN':
                        item.removeClass('scale-0').addClass('scale-1');
                        break;
                }
            };

            if(filterData == 'ALL') {
                onItem(filteringItems,'open');
            } else {
                filteringItems.each(function() {
                    if($(this).attr('data-filterin')) {
                        if($(this).attr('data-filterin').trim().toUpperCase() === filterData) {
                            onItem($(this),'open');
                            $(this).prependTo('.gallery');
                        } else {
                            onItem($(this),'close');
                        }
                    }
                });
            }
        }

        $(filter_link).on('click', function (e) {
            e.preventDefault();
            setFilt.call(this);
        });
    }

    /**
     * @return gallery
     */
    function InitGallery() {
        let g = $('.gallery').lightGallery({
            escKey:true,
            closable:true,
            download:true,
            loop:true
        });
        setInterval(function() {
            if($('body').hasClass('video_page')) {
                let el = $('.lg-current .lg-video iframe');
                let imgW = el.width();
                $('.lg-actions').css({
                    'width':imgW+140+'px'
                });
            } else {
                let el = $('.lg-current .lg-img-wrap img');
                let imgW = el.width();
                $('.lg-actions').css({
                    'width':imgW+140+'px'
                });
            }
        }, 500);
    }

    /**
     * @return start all functions
     */
    function all() {
        if(document.body.className.indexOf('main_page')>-1) {
            setBodyProps();
        }

        BurgerMenu();
        FilterVideoImage('.filter_item','.item_block');
        InitGallery();
    }

    all();
});