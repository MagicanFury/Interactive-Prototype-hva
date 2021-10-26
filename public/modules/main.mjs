const ROUTES = {
    Statistics: {
        
    },
    Workout: {

    }
}

const $pages = $('.page')
const $footerLinks = $('.footer a')

let title = ''
let selectedPage = null
let selectedPageI = -1
let nestedPage = null


function selectTabbarPage({ i, $a }) {
    // Tabbar Logic
    $footerLinks.each((i, a) => {
        $(a).removeClass('active')
    })
    $a.addClass('active')

    // Page Logic
    const moveLeft = (i < selectedPageI)
    const lastSelectedPage = selectedPage
    const width = lastSelectedPage.outerWidth()
    
    lastSelectedPage.animate({
        left: (moveLeft) ? width : -width
    }, 300, function() {
        lastSelectedPage.removeClass('active')
    })

    selectedPage = $pages.eq(i)
    selectedPage.css({ left: (moveLeft) ? -width : width })

    selectedPage.addClass('active')
    selectedPage.animate({ left: 0 }, 300, function() {

    })
    selectedPageI = i
}

function navigateBackFromNestedPage() {
    console.log('>> BACK')
    if (nestedPage) {
        nestedPage.animate({ opacity: 0 }, 150, () => {
            nestedPage.removeClass('active')
            nestedPage = null
        })
    }
}

function showNestedPage({ key, selector, title }) {
    const $nestedPage = $(selector)
    $nestedPage.find('.ios-back-label[href="#back"]').text(getPageTitle())
    $nestedPage.find('.navigation .title span').text(title)
    $nestedPage.css({ opacity: 0, top: '10px' })
    $nestedPage.addClass('active')
    $nestedPage.animate({ opacity: 1, top: 0 }, 150)
    nestedPage = $nestedPage
}


function setViewHeight() {
    const subtract = Math.round($('.status').height() + $('.footer').height())
    $('.content').height(`calc(100% - ${ subtract }px)`)
}

function centerPhonePosition() {
    const $phone = $('.phone')
    const fullHeight = window.innerHeight
    const height = $phone.height()
    const margin = (fullHeight - height) / 2
    $phone.css({
        'margin-top': Math.floor(margin),
        'margin-bottom': Math.ceil(margin)
    })
}

function createListHandlersWorkout() {
    $('#workouts li').click(e => {
        e.preventDefault()

        const title = $(e.target).closest('li').find('.title').text()
        showNestedPage({ key: title, selector: '.page-workout-i', title })
    })
}

function getPageTitle() {
    return selectedPage.find('.navigation .title').text()
}

function main() {
    console.log('main')
    $('[href="#"]').click(e => {
        e.preventDefault()
    })

    $('[href="#back"]').click(e => {
        e.preventDefault()
        navigateBackFromNestedPage()
    })


    $footerLinks.each((i, a) => {
        const $a = $(a)
        selectedPage = $('.page.active')
        selectedPageI = $('.page').toArray().map((page, i) => $(page).is(selectedPage) ? i : null).filter(v => v !== null).pop()

        $a.click(e => {
            e.preventDefault()
            selectTabbarPage({ i, $a })
        })
    })


    setViewHeight()
    centerPhonePosition()
    createListHandlersWorkout()
}

$(_ => {
    main()
})