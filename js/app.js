document.addEventListener("DOMContentLoaded", function() {

    "use strict";
	// Custom JS
    // BurgerMenu


    function BurgerMenu(){
        let BurgerIcon = document.querySelector('.icon-menu');
        let BurgerMenu= document.querySelector('.menu__body');
        BurgerIcon.addEventListener('click', function(){
            BurgerIcon.classList.toggle('active');
            BurgerMenu.classList.toggle('active');
        });
    }
    BurgerMenu();
    // ifMobile
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
    function isIE() {
        ua = navigator.userAgent;
        var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
        return is_ie;
    }
    if (isIE()) {
        document.querySelector('body').classList.add('ie');
    }
    if (isMobile.any()) {
        document.querySelector('body').classList.add('_touch');
    }


    // Adaptiv
    (function () {
        let originalPositions = [];
        let daElements = document.querySelectorAll('[data-da]');
        let daElementsArray = [];
        let daMatchMedia = [];
        //Заполняем массивы
        if (daElements.length > 0) {
            let number = 0;
            for (let index = 0; index < daElements.length; index++) {
                const daElement = daElements[index];
                const daMove = daElement.getAttribute('data-da');
                if (daMove != '') {
                    const daArray = daMove.split(',');
                    const daPlace = daArray[1] ? daArray[1].trim() : 'last';
                    const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
                    const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
                    const daDestination = document.querySelector('.' + daArray[0].trim())
                    if (daArray.length > 0 && daDestination) {
                        daElement.setAttribute('data-da-index', number);
                        //Заполняем массив первоначальных позиций
                        originalPositions[number] = {
                            "parent": daElement.parentNode,
                            "index": indexInParent(daElement)
                        };
                        //Заполняем массив элементов
                        daElementsArray[number] = {
                            "element": daElement,
                            "destination": document.querySelector('.' + daArray[0].trim()),
                            "place": daPlace,
                            "breakpoint": daBreakpoint,
                            "type": daType
                        }
                        number++;
                    }
                }
            }
            dynamicAdaptSort(daElementsArray);

            //Создаем события в точке брейкпоинта
            for (let index = 0; index < daElementsArray.length; index++) {
                const el = daElementsArray[index];
                const daBreakpoint = el.breakpoint;
                const daType = el.type;

                daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
                daMatchMedia[index].addListener(dynamicAdapt);
            }
        }
        //Основная функция
        function dynamicAdapt(e) {
            for (let index = 0; index < daElementsArray.length; index++) {
                const el = daElementsArray[index];
                const daElement = el.element;
                const daDestination = el.destination;
                const daPlace = el.place;
                const daBreakpoint = el.breakpoint;
                const daClassname = "_dynamic_adapt_" + daBreakpoint;

                if (daMatchMedia[index].matches) {
                    //Перебрасываем элементы
                    if (!daElement.classList.contains(daClassname)) {
                        let actualIndex = indexOfElements(daDestination)[daPlace];
                        if (daPlace === 'first') {
                            actualIndex = indexOfElements(daDestination)[0];
                        } else if (daPlace === 'last') {
                            actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
                        }
                        daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
                        daElement.classList.add(daClassname);
                    }
                } else {
                    //Возвращаем на место
                    if (daElement.classList.contains(daClassname)) {
                        dynamicAdaptBack(daElement);
                        daElement.classList.remove(daClassname);
                    }
                }
            }
            customAdapt();
        }

        //Вызов основной функции
        dynamicAdapt();

        //Функция возврата на место
        function dynamicAdaptBack(el) {
            const daIndex = el.getAttribute('data-da-index');
            const originalPlace = originalPositions[daIndex];
            const parentPlace = originalPlace['parent'];
            const indexPlace = originalPlace['index'];
            const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
            parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
        }
        //Функция получения индекса внутри родителя
        function indexInParent(el) {
            var children = Array.prototype.slice.call(el.parentNode.children);
            return children.indexOf(el);
        }
        //Функция получения массива индексов элементов внутри родителя
        function indexOfElements(parent, back) {
            const children = parent.children;
            const childrenArray = [];
            for (let i = 0; i < children.length; i++) {
                const childrenElement = children[i];
                if (back) {
                    childrenArray.push(i);
                } else {
                    //Исключая перенесенный элемент
                    if (childrenElement.getAttribute('data-da') == null) {
                        childrenArray.push(i);
                    }
                }
            }
            return childrenArray;
        }
        //Сортировка объекта
        function dynamicAdaptSort(arr) {
            arr.sort(function (a, b) {
                if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
            });
            arr.sort(function (a, b) {
                if (a.place > b.place) { return 1 } else { return -1 }
            });
        }
        function customAdapt() {
            //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        }

    }());

    //Menu Page
    if (isMobile.any()) {
        let menuParents = document.querySelectorAll('.menu-page__parent>a');
        for (let index = 0; index < menuParents.length; index++) {
            const menuParent = menuParents[index];
            menuParent.addEventListener("click", function (e) {
                menuParent.parentElement.classList.toggle('active');
                e.preventDefault();
            });
        }
    } else {
        let menuParents = document.querySelectorAll('.menu-page__parent');
        for (let index = 0; index < menuParents.length; index++) {
            const menuParent = menuParents[index];
            menuParent.addEventListener("mouseenter", function (e) {
                menuParent.classList.add('active');
            });
            menuParent.addEventListener("mouseleave", function (e) {
                menuParent.classList.remove('active');
            });
        }
    }
    /////////////////////////


    function BurgerMenuPage(){
        let menuPageBurger = document.querySelector('.menu-page__burger');
        let menuPageBody   = document.querySelector('.menu-page__body');
        menuPageBurger.addEventListener('click', function(e){
            e.preventDefault();
            menuPageBurger.classList.toggle('active');
            menuPageBody.classList.toggle('active');
        });
    }
    BurgerMenuPage();

    //Search
    let searchSelect = document.querySelector('.search-page__select');
    let categoriesSearch = document.querySelector('.categories-search');
    searchSelect.addEventListener('click', function (e) {
        categoriesSearch.classList.toggle('active');
    });

   /* let checkboxCategories = document.querySelectorAll('.categories-search__checkbox');

    for(let index = 0; index < checkboxCategories.length; index++){
        const checkboxCategory = checkboxCategories[index];
        checkboxCategory.addEventListener('change', function (e) {
            checkboxCategory.classList.toggle('active');

            let checkboxActiveCategories = document.querySelectorAll('.categories-search__checkbox.active');

            if(checkboxActiveCategories.length > 0){
                searchSelect.classList.toggle('_categories');
            }else{
                searchSelect.classList.remove('_categories');
            }
        });
    }*/
});

let sliders = document.querySelectorAll('._swiper');
if(sliders){
    for(let index = 0; index < sliders.length; index++){
        let slider = sliders[index];
        if(!slider.classList.contains('swiper-bild')){
            let slider_items = slider.children;
            if(slider_items){
                for(let index = 0; index < slider_items.length; index++){
                    let el = slider_items[index];
                    el.classList.add('swiper-slide');
                }
            }
            let slider_content = slider.innerHTML;
            let slider_wrapper = document.createElement('div');
            slider_wrapper.classList.add('swiper-wrapper');
            slider_wrapper.innerHTML = slider_content;
            slider.innerHTML = '';
            slider.appendChild(slider_wrapper);
            slider.classList.add('swiper-bild');
        }
        if(slider.classList.contains('_gallery')){

        }
    }
    sliders_bild_callback();
}

function sliders_bild_callback(params) {}

if (document.querySelector('.mainslider')) {
    let mainslider = new Swiper('.mainslider__body', {
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        autoHeight: true,
        speed: 800,
        //loop: true,
        //preloadImages: false,
        //lazy: true,
        // Dotts
        pagination: {
            el: '.mainslider__dotts',
            clickable: true,
        },
        // Arrows
        /*
        navigation: {
            nextEl: '.about__more .more__item_next',
            prevEl: '.about__more .more__item_prev',
        },
        */
        /*
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 0,
                autoHeight: true,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1268: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
        },
        */
        on: {
            lazyImageReady: function () {
                ibg();
            },
        }
        // And if we need scrollbar
        //scrollbar: {
        //	el: '.swiper-scrollbar',
        //},
    });
    let mainsliderImages = document.querySelectorAll('.mainslider__image');
    let mainsliderDotts = document.querySelectorAll('.mainslider__dotts .swiper-pagination-bullet');

    for (let index = 0; index < mainsliderImages.length; index++) {
        const mainsliderImage = mainsliderImages[index].querySelector('img').getAttribute('src');
        mainsliderDotts[index].style.backgroundImage = "url('" + mainsliderImage + "')";
    }
}

if (document.querySelector('.products-slider')) {
    let productsSlider = new Swiper('.products-slider__item', {
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        autoHeight: true,
        speed: 800,
        loop: true,
        //preloadImages: false,
        //lazy: true,
        // Dotts

        pagination: {
            el: '.products-slider__info',
            type: 'fraction'
        },
        // Arrows
        navigation: {
            nextEl: '.products-slider__arrow_next',
            prevEl: '.products-slider__arrow_prev',
        },
        on: {
            lazyImageReady: function () {
                ibg();
            },
        }
    });
}
if (document.querySelector('.brands-slider')) {
    let brandSlider = new Swiper('.brands-slider__body', {
        observer: true,
        observeParents: true,
        slidesPerView: 5,
        spaceBetween: 0,
        /*autoHeight: true,*/
        speed: 800,
        loop: true,
        //preloadImages: false,
        //lazy: true,
        // Dotts

        // Arrows
        /*navigation: {
            nextEl: '.products-slider__arrow_next',
            prevEl: '.products-slider__arrow_prev',
        },*/
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 0,
                autoHeight: true,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            992: {
                slidesPerView: 5,
                spaceBetween: 20,
            },
        },
    });
}


const priceSlider = document.querySelector('.price-filter__slider');
if (priceSlider) {
    noUiSlider.create(priceSlider, {
        start: [0, 200000],
        connect: true,
        tooltips: true,
        range: {
            'min': [0],
            'max': [200000]
        }
    });

    const priceStart = document.getElementById('price-start');
    const priceEnd = document.getElementById('price-end');
    priceStart.addEventListener('change', setPriceValues);
    priceEnd.addEventListener('change', setPriceValues);

    function setPriceValues() {
        let priceStartValue;
        let priceEndValue;
        if (priceStart.value != '') {
            priceStartValue = priceStart.value;
        }
        if (priceEnd.value != '') {
            priceEndValue = priceEnd.value;
        }
        priceSlider.noUiSlider.set([priceStartValue, priceEndValue]);
    }
}

//=================
//Spollers
let spollers = document.querySelectorAll("._spoller");
if (spollers.length > 0) {
    for (let index = 0; index < spollers.length; index++) {
        const spoller = spollers[index];
        spoller.addEventListener("click", function (e) {
            if (spoller.classList.contains('_spoller-992') && window.innerWidth > 992) {
                return false;
            }
            if (spoller.classList.contains('_spoller-768') && window.innerWidth > 768) {
                return false;
            }
            if (spoller.closest('._spollers').classList.contains('_one')) {
                let curent_spollers = spoller.closest('._spollers').querySelectorAll('._spoller');
                for (let i = 0; i < curent_spollers.length; i++) {
                    let el = curent_spollers[i];
                    if (el != spoller) {
                        el.classList.remove('_active');
                    }
                }
            }
            spoller.classList.toggle('_active');
        });
    }
}



//Select
let selects = document.getElementsByTagName('select');
if (selects.length > 0) {
    selects_init();
}
function selects_init() {
    for (let index = 0; index < selects.length; index++) {
        const select = selects[index];
        select_init(select);
    }
    //select_callback();
    document.addEventListener('click', function (e) {
        selects_close(e);
    });
    document.addEventListener('keydown', function (e) {
        if (e.which == 27) {
            selects_close(e);
        }
    });
}
function selects_close(e) {
    const selects = document.querySelectorAll('.select');
    if (!e.target.closest('.select')) {
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            const select_body_options = select.querySelector('.select__options');
            select.classList.remove('_active');
        }
    }
}
function select_init(select) {
    const select_parent = select.parentElement;
    const select_modifikator = select.getAttribute('class');
    const select_selected_option = select.querySelector('option:checked');
    select.setAttribute('data-default', select_selected_option.value);
    select.style.display = 'none';

    select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>');

    let new_select = select.parentElement.querySelector('.select');
    new_select.appendChild(select);
    select_item(select);
}
function select_item(select) {
    const select_parent = select.parentElement;
    const select_items = select_parent.querySelector('.select__item');
    const select_options = select.querySelectorAll('option');
    const select_selected_option = select.querySelector('option:checked');
    const select_selected_text = select_selected_option.text;
    const select_type = select.getAttribute('data-type');

    if (select_items) {
        select_items.remove();
    }

    let select_type_content = '';
    if (select_type == 'input') {
        select_type_content = '<div class="select__value icon-select-arrow"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-error="Ошибка" data-value="' + select_selected_text + '" class="select__input"></div>';
    } else {
        select_type_content = '<div class="select__value icon-select-arrow"><span>' + select_selected_text + '</span></div>';
    }

    select_parent.insertAdjacentHTML('beforeend',
        '<div class="select__item">' +
        '<div class="select__title">' + select_type_content + '</div>' +
        '<div class="select__options">' + select_get_options(select_options) + '</div>' +
        '</div></div>');

    select_actions(select, select_parent);
}
function select_actions(original, select) {
    const select_item = select.querySelector('.select__item');
    const select_body_options = select.querySelector('.select__options');
    const select_options = select.querySelectorAll('.select__option');
    const select_type = original.getAttribute('data-type');
    const select_input = select.querySelector('.select__input');

    select_item.addEventListener('click', function () {
        let selects = document.querySelectorAll('.select');
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            const select_body_options = select.querySelector('.select__options');
            if (select != select_item.closest('.select')) {
                select.classList.remove('_active');
            }
        }
        select.classList.toggle('_active');
    });

    for (let index = 0; index < select_options.length; index++) {
        const select_option = select_options[index];
        const select_option_value = select_option.getAttribute('data-value');
        const select_option_text = select_option.innerHTML;

        if (select_type == 'input') {
            select_input.addEventListener('keyup', select_search);
        } else {
            if (select_option.getAttribute('data-value') == original.value) {
                select_option.style.display = 'none';
            }
        }
        select_option.addEventListener('click', function () {
            for (let index = 0; index < select_options.length; index++) {
                const el = select_options[index];
                el.style.display = 'block';
            }
            if (select_type == 'input') {
                select_input.value = select_option_text;
                original.value = select_option_value;
            } else {
                select.querySelector('.select__value').innerHTML = '<span>' + select_option_text + '</span>';
                original.value = select_option_value;
                select_option.style.display = 'none';
            }
        });
    }
}
function select_get_options(select_options) {
    if (select_options) {
        let select_options_content = '';
        for (let index = 0; index < select_options.length; index++) {
            const select_option = select_options[index];
            const select_option_value = select_option.value;
            if (select_option_value != '') {
                const select_option_text = select_option.text;
                select_options_content = select_options_content + '<div data-value="' + select_option_value + '" class="select__option">' + select_option_text + '</div>';
            }
        }
        return select_options_content;
    }
}
function select_search(e) {
    let select_block = e.target.closest('.select ').querySelector('.select__options');
    let select_options = e.target.closest('.select ').querySelectorAll('.select__option');
    let select_search_text = e.target.value.toUpperCase();

    for (let i = 0; i < select_options.length; i++) {
        let select_option = select_options[i];
        let select_txt_value = select_option.textContent || select_option.innerText;
        if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
            select_option.style.display = "";
        } else {
            select_option.style.display = "none";
        }
    }
}
function selects_update_all() {
    let selects = document.querySelectorAll('select');
    if (selects) {
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            select_item(select);
        }
    }
}
////End Select

//=================
//Slider Swiper

if (document.querySelector('.images-product')) {
    let imagesSubSlider = new Swiper('.images-product__subslider', {
        observer: true,
        observeParents: true,
        slidesPerView: 4,
        spaceBetween: 0,
        //autoHeight: true,
        speed: 800,
        //loop: true,
        //preloadImages: false,
        //lazy: true,
    });
    let imagesMainSlider = new Swiper('.images-product__mainslider', {
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 0,
        thumbs: {
            swiper: imagesSubSlider
        },
        //autoHeight: true,
        speed: 800,
        //loop: true,
        //preloadImages: false,
        //lazy: true,
    });
}
//=================
//quantity

let quantityButtons = document.querySelectorAll('.quantity__button');
if (quantityButtons.length > 0) {
    for (let index = 0; index < quantityButtons.length; index++) {
        const quantityButton = quantityButtons[index];
        quantityButton.addEventListener("click", function (e) {
            let value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);
            if (quantityButton.classList.contains('quantity__button_plus')) {
                value++;
            } else {
                value = value - 1;
                if (value < 1) {
                    value = 1
                }
            }
            quantityButton.closest('.quantity').querySelector('input').value = value;
        });
    }
}

//=================
//Tabs
let tabs = document.querySelectorAll("._tabs");
for (let index = 0; index < tabs.length; index++) {
    let tab = tabs[index];
    let tabs_items = tab.querySelectorAll("._tabs-item");
    let tabs_blocks = tab.querySelectorAll("._tabs-block");
    for (let index = 0; index < tabs_items.length; index++) {
        let tabs_item = tabs_items[index];
        tabs_item.addEventListener("click", function (e) {
            for (let index = 0; index < tabs_items.length; index++) {
                let tabs_item = tabs_items[index];
                tabs_item.classList.remove('_active');
                tabs_blocks[index].classList.remove('_active');
            }
            tabs_item.classList.add('_active');
            tabs_blocks[index].classList.add('_active');
            e.preventDefault();
        });
    }
}

///////////Ibg Image
function ibg() {
    if (isIE()) {
        let ibg = document.querySelectorAll("._ibg");
        for (var i = 0; i < ibg.length; i++) {
            if (ibg[i].querySelector('img') && ibg[i].querySelector('img').getAttribute('src') != null) {
                ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
            }
        }
    }
}
ibg();
