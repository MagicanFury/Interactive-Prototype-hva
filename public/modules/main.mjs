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

function navigateBackFromNestedPage({ parent, view, $nestedPage }) {
    console.log('>> BACK')
    if ($nestedPage) {
        if (!parent.hasClass('hasNestedPage')) {
            console.error(`Parent doesn't have class hasNestedPage!!`)
        }
        parent.removeClass('hasNestedPage')
        $nestedPage.animate({ opacity: 0 }, 150, () => {
            $nestedPage.remove()
            $nestedPage = null
            // $('.phone').removeClass('is-in-nested')
        })
    }
}

function showNestedPage({ parent, view, overrideTitle }) {
    const { title, $element, onShow } = viewService.loadView(view)

    const $nestedPage = $('.template.nested-page').clone()
    $nestedPage.removeClass('template')
    
    $nestedPage.find('[href="#"]').click(e => {
        e.preventDefault()
    })

    $nestedPage.find('[href="#back"]').click(e => {
        e.preventDefault()
        navigateBackFromNestedPage({ parent, view, $nestedPage })
    })

    parent.prepend($nestedPage)
    parent.addClass('hasNestedPage')

    $nestedPage.find('.ios-back-label[href="#back"]').text(getPageTitle())
    $nestedPage.find('.navigation .title span').text(overrideTitle || title)
    // Clear & Set Content
    const $content = $nestedPage.find('.content')
    $content.html('')
    $content.append($element)

    $nestedPage.css({ opacity: 0, top: '10px' })
    $nestedPage.addClass('active')
    $nestedPage.animate({ opacity: 1, top: 0 }, 150)
    // $('.phone').addClass('is-in-nested')
    nestedPage = $nestedPage
    setNestedPageHeight()

    if (onShow) {
        try {
            onShow({
                parent,
                $nestedPage,
                $element,
                goBack: () => navigateBackFromNestedPage({ parent, view, $nestedPage })
            })
        } catch (err) {
            console.error(err)
        }
    }
}


function setViewHeight() {
    const subtract = Math.round($('.status').height() + $('.footer').height())
    $('.content').height(`calc(100% - ${ subtract }px)`)
}

function setNestedPageHeight() {
    const $nav = nestedPage.find('.navigation')
    let subtract = $nav.height()
    nestedPage.find('.content').height(`calc(100% - ${ Math.round(subtract) }px)`)
}

function centerPhonePosition() {
    if ($('body').css('overflow-y') !== 'hidden') {
        return
    }
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

        const showPage = () => {
            const $li = $(e.target).closest('li')
            const view = $li.find('[loadview]').attr('loadview')
            const overrideTitle = $li.find('.title').text()
            showNestedPage({
                parent: $li.closest('.page'),
                view,
                key: title,
                overrideTitle
            })
        }

        showPage()
        // modalService.popup({
        //     title: `Continue?`,
        //     message: `Are you sure you want to see the chart?`,
        //     type: ModalService.MODAL_TYPES.YES_NO
        // }).on([
        //     // Yes
        //     () => showPage(),
        //     // No
        //     () => {
        //     }
        // ])
    })
}

function createListHandlersWorkout() {
    $('#workouts li').click(e => {
        e.preventDefault()

        const $li = $(e.target).closest('li')
        const isActive = ($li.find('.inactive').length === 0)
        if (!isActive) {
            return modalService.popup({
                title: 'Not Yet!',
                message: `You have not unlocked this workout yet!<br>Lv. ${ $li.index() + 1 } is required`,
                type: ModalService.MODAL_TYPES.OK
            })
        }
        const view = $li.find('[loadview]').attr('loadview')
        const overrideTitle = $li.find('.title').text()
        showNestedPage({
            parent: $li.closest('.page'),
            view,
            key: title,
            overrideTitle
        })
    
    })
}

function getPageTitle() {
    return selectedPage.find('.navigation .title').text()
}

function createSearchHandler() {
    const $workouts = $('#workouts')
    const $lis = $workouts.find('li')
    const $search = $('#search')
    $search.keyup(e => {
        const searchValue = $search.val().toLowerCase()
        $lis.each((i, li) => {
            const liText = $(li).text().trim().toLowerCase()
            const showLi = (liText.includes(searchValue))
            $(li).toggleClass('hidden', !showLi)
        })
    })
}

function createProfileHandlers() {
    $('#rateApp').click(e => {
        e.preventDefault()
        modalService.popup({
            title: `Thank You!`,
            message: `You have rated the app!`,
            type: ModalService.MODAL_TYPES.OK
        })
    })
    $('#share').click(e => {
        e.preventDefault()
        modalService.popup({
            title: `Thank You!`,
            message: `You've shared the app!`,
            type: ModalService.MODAL_TYPES.OK
        })
    })
    $('#resetProfile').click(e => {
        e.preventDefault()
        modalService.popup({
            title: `Are you sure?`,
            message: `Do you want to reset the app?<br/>This acount can't be undone`,
            type: ModalService.MODAL_TYPES.YES_NO,
            cls: 'modal-danger'
        })
    })
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
    createSearchHandler()
    createListHandlersWorkout()
    createListHandlersStatistics()
    createProfileHandlers()
    processUrlParams()
}

function processUrlParams() {
    if (window.location.search.length === 0) {
        return
    }
    window.location.search.substr(1).split('&').map(param => {
        const [key, value] = param.split('=')
        switch (key) {
            case 'zoom':
                $('body').css({ zoom: value })
                break;
        }
    })
}

$(_ => {
    main()

    $(window).resize(() => {
        centerPhonePosition()
    })
})