import { ModalService } from "./services/ModalService.js"
import { ViewService } from "./services/ViewService.js"

var modalService = ModalService.get()
var viewService = ViewService.get()

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

function showNestedPage({ view, selector, overrideTitle }) {
    const { title, $element } = viewService.loadView(view)

    const $nestedPage = $(selector)
    $nestedPage.find('.ios-back-label[href="#back"]').text(getPageTitle())
    $nestedPage.find('.navigation .title span').text(overrideTitle || title)
    // Clear & Set Content
    const $content = $nestedPage.find('.content')
    $content.html('')
    $content.append($element)

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
    const DEFAULT_PHONE_HEIGHT = 736
    const MARGIN_AROUND_PHONE = 32

    const $phone = $('.phone')
    const viewHeight = window.innerHeight
    const contentHeight = DEFAULT_PHONE_HEIGHT + MARGIN_AROUND_PHONE * 2
    if (viewHeight < contentHeight) {
        const scale = Math.round(viewHeight / contentHeight * 1000) / 1000
        $phone.css({ zoom: scale })
    }
    $phone.css({
        'margin-top': MARGIN_AROUND_PHONE,
        'margin-bottom': MARGIN_AROUND_PHONE
    })
}

function createListHandlersStatistics() {
    $('#statistics li').click(e => {
        e.preventDefault()

        modalService.popup({
            title: `Delete "Spend"`,
            message: `Deleting "Spend" will also delete all of its data.`,
            type: ModalService.MODAL_TYPES.DELETE_CANCEL
        }).on([
            // Delete
            () => {
                console.log('DELETE')
            },
            // Cancel
            () => {
                console.log('CANCEL')
            }
        ])
    })
}

function createListHandlersWorkout() {
    $('#workouts li').click(e => {
        e.preventDefault()

        const $li = $(e.target).closest('li')
        if ($li.find('.inactive').length === 0) {
            const view = $li.find('[loadview]').attr('loadview')
            const overrideTitle = $li.find('.title').text()
            showNestedPage({ view, key: title, selector: '.page-workout-i', overrideTitle })
        }
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
    createListHandlersStatistics()
}

$(_ => {
    main()

    $(window).resize(() => {
        centerPhonePosition()
    })
})