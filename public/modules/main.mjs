import { ModalService } from "./services/ModalService.js"
import { ViewService } from "./services/ViewService.js"

var modalService = ModalService.get()
var viewService = ViewService.get()

const $pages = $('.page')
const $footer = $('.footer')
const $flyout = $('.menu-flyout')
const $footerLinks = $('.footer a')
const $flyoutLinks = $('.menu-flyout [uid]')

let title = ''
let selectedPage = null
let selectedPageI = -1
let selectedPageUid = null
let nestedPage = null

function getPageIndex($page) {
    let pageIndex = null
    const $pages = $('.phone > .content > .page')
    $pages.each((i, page) => {
        if ($(page).is($page)) {
            pageIndex = i
        }
    })
    if (pageIndex === null) {
        console.error(`couldn't get page: `, $page)
    }
    return pageIndex
}

function initPages() {
    selectedPage = $('.phone > .content > .page.active')
    selectedPageI = getPageIndex(selectedPage)
    selectedPageUid = selectedPage.attr('uid')
}

function toggleFlyout($flyout, forcedValue) {
    $flyout.toggleClass('active', forcedValue)
    $('.phone').toggleClass('flyout-enabled', $flyout.is('.active'))
}

function createFlyoutHandlers() {
    const $flyout = $('.menu-flyout')
    const $hamburgers = $('.nav-item.flyout')
    $hamburgers.each((i, hamburger) => {
        const $hamburger = $(hamburger)
        $hamburger.click(e => {
            e.preventDefault()
            toggleFlyout($flyout, true)
        })
    })
    $flyout.find('[href="#close"]').click(e => {
        e.preventDefault()
        toggleFlyout($flyout)
    })

    $flyout.find('[uid]').each((i, a) => {
        const $a = $(a)
        const uid = $a.attr('uid')
        $a.click(e => {
            e.preventDefault()
            selectPage({ uid, skipAnimation: true })
            toggleFlyout($flyout, false)
        })
    })
}

function createTabbarHandlers() {
    $footerLinks.each((i, a) => {
        const $a = $(a)
        const uid = $a.attr('uid')
        $a.click(e => {
            e.preventDefault()
            selectPage({ uid })
        })
    })
}

function selectPage({ uid, skipAnimation }) {
    const pageToSelect = $pages.filter(`[uid="${uid}"]`).eq(0)
    const pageToSelectIndex = getPageIndex(pageToSelect)
    if (selectedPageUid === uid || pageToSelect.length === 0 || pageToSelectIndex === null) {
        return
    }
    const ANIMATION_TIME = (skipAnimation === true) ? 0 : 300

    console.log('Loading uid=' + uid)
    // Tabbar Logic
    $flyoutLinks.each((i, a) => { $(a).removeClass('active') })
    $footerLinks.each((i, a) => { $(a).removeClass('active') })
    $flyout.find(`[uid="${uid}"]`).addClass('active')
    $footer.find(`[uid="${uid}"]`).addClass('active')

    // Page Logic
    const lastSelectedPage = selectedPage
    const width = lastSelectedPage.outerWidth()

    selectedPage = pageToSelect
    const moveLeft = (pageToSelectIndex < selectedPageI)
    
    lastSelectedPage.animate({
        left: (moveLeft) ? width : -width
    }, ANIMATION_TIME, function() {
        lastSelectedPage.removeClass('active')
    })

    selectedPage.css({ left: (moveLeft) ? -width : width })

    selectedPage.addClass('active')
    selectedPage.animate({ left: 0 }, ANIMATION_TIME, function() {
        console.log('Done animating to page', { selectedPage, selectedPageI })
    })
    selectedPageI = pageToSelectIndex
    selectedPageUid = uid
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
    const $phone = $('.phone')
    const DEFAULT_PHONE_HEIGHT = 736
    const MARGIN_AROUND_PHONE = 24
    if ($('body').css('overflow-y') !== 'hidden') {
        return
    }
    $phone.css({
        'margin-top': MARGIN_AROUND_PHONE + 'px',
        'margin-bottom': MARGIN_AROUND_PHONE + 'px'
    })

    const viewHeight = window.innerHeight
    const contentHeight = DEFAULT_PHONE_HEIGHT + MARGIN_AROUND_PHONE * 2
    if (viewHeight < contentHeight) {
        const scale = Math.round(viewHeight / contentHeight * 1000) / 1000
        $phone.css({ zoom: scale })
    }
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
    $('#workouts-A,#workouts-B').find('.card').each((i, ele) => {
        const $ele = $(ele)
        if ($ele.is('.inactive') || $ele.find('.inactive').length > 0) {
            $ele.html($ele.text() + `<br/> (Lv. ${ $ele.index() } Required)`)
        }
    })
    $('#workouts-A,#workouts-B').find('li,.card').click(e => {
        e.preventDefault()

        const $li = $(e.target).closest('li,.card')
        const isInactive = ($li.is('.inactive') || $li.find('.inactive').length > 0)
        if (isInactive) {
            return modalService.popup({
                title: 'Not Yet!',
                message: `You have not unlocked this workout yet!<br>Lv. ${ $li.index() + 1 } is required`,
                type: ModalService.MODAL_TYPES.OK
            })
        }
        const view = ($li.is('[loadview]') ? $li : $li.find('[loadview]')).attr('loadview')
        const overrideTitle = ($li.is('[loadview') ? $li : $li.find('.title')).text()
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
    const $workouts = $('#workouts-A,#workouts-B')
    const $lis = $workouts.find('li,.card')
    const $search = $('#search')
    $search.keyup(_ => {
        const searchValue = $search.val().toLowerCase()
        $lis.each((_, li) => {
            const liText = $(li).text().trim().toLowerCase()
            const showLi = (liText.includes(searchValue))
            $(li).toggleClass('hidden', !showLi)
        })
    })
}

function createProfileHandlers() {
    $('[href="#rateApp"]').click(e => {
        e.preventDefault()
        modalService.popup({
            title: `Thank You!`,
            message: `You have rated the app!`,
            type: ModalService.MODAL_TYPES.OK
        })
    })
    $('[href="#share"]').click(e => {
        e.preventDefault()
        modalService.popup({
            title: `Thank You!`,
            message: `You've shared the app!`,
            type: ModalService.MODAL_TYPES.OK
        })
    })
    $('[href="#resetProfile"]').click(e => {
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


    
    
    initPages()
    setViewHeight()
    centerPhonePosition()
    createSearchHandler()
    createListHandlersWorkout()
    createListHandlersStatistics()
    createProfileHandlers()
    createTabbarHandlers()
    processUrlParams()

    // Version B
    createFlyoutHandlers()
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
            case 'version':
                $('.phone').attr(key, value)
        }
    })
}

$(_ => {
    main()

    $(window).resize(() => {
        centerPhonePosition()
    })
})