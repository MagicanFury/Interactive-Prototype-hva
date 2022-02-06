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

let allPaths = {}
let currentPath = []

initCurrentPath()

function initCurrentPath() {
    let baseTitle = $('.phone > .content > [uid].page.active > header .title').eq(0).text().trim()
    if (!allPaths.hasOwnProperty(baseTitle)) {
        allPaths[baseTitle] = [baseTitle]
    }
    currentPath = allPaths[baseTitle]
}

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
    if (!$flyout || $flyout.length === 0) {
        $flyout = $('.menu-flyout')
    }
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
        initCurrentPath()
        console.log('path', currentPath)
    })

    selectedPage.css({ left: (moveLeft) ? -width : width })

    selectedPage.addClass('active')
    selectedPage.animate({ left: 0 }, ANIMATION_TIME, function() {
        console.log('Done animating to page', { selectedPage, selectedPageI })
    })

    selectedPageI = pageToSelectIndex
    selectedPageUid = uid
}

function navigateBackFromNestedPages() {
    while (currentPath.length > 1) {
        // console.log(nestedPage)
        // const parent = $('[uid].page.active')
        // const $nestedPage = $('[uid].page.active').find('.page.hasNestedPage').eq(0)
        navigateBackFromNestedPage({ parent: nestedPage.closest('.page.hasNestedPage'), $nestedPage: nestedPage })
    }
}

function navigateBackFromNestedPage({ parent, $nestedPage }) {
    allPaths[currentPath[0]].pop()
    currentPath = allPaths[currentPath[0]]
    console.log('path', currentPath)

    $('[uid].page.active > header > ul > .title').toggleClass('hidden', currentPath.length !== 1)

    if ($nestedPage) {
        if (!parent.hasClass('hasNestedPage')) {
            console.error(`Parent doesn't have class hasNestedPage!!`)
        }
        parent.toggleClass('hasNestedPage', nestedPage != null)
        let $closestNestedPage = $nestedPage.closest('.page.hasNestedPage')
        $closestNestedPage.removeClass('hasNestedPage')

        let $toDelete = $nestedPage
        $toDelete.animate({ opacity: 0 }, 150, () => {
            $toDelete.remove()
            // $('.phone').removeClass('is-in-nested')
        })
        $nestedPage = $closestNestedPage.length ? $closestNestedPage : null
        nestedPage = $nestedPage
    }
}

function showNestedPage({ parent, view, overrideTitle }, pageArgs) {
    const { title, $element, onShow } = viewService.loadView(view, pageArgs)

    const displayTitle = overrideTitle || title
    const $nestedPage = $('.template.nested-page').clone()
    $nestedPage.removeClass('template')
    
    $nestedPage.find('[href="#"]').click(e => {
        e.preventDefault()
    })

    $nestedPage.find('[href="#back"]').click(e => {
        e.preventDefault()
        navigateBackFromNestedPage({ parent, $nestedPage })
    })

    parent.prepend($nestedPage)
    parent.addClass('hasNestedPage')

    $nestedPage.find('.ios-back-label[href="#back"]').text(currentPath[currentPath.length - 1])
    $nestedPage.find('.navigation .title span').text(displayTitle)
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

    allPaths[currentPath[0]].push((displayTitle || '').trim())
    currentPath = allPaths[currentPath[0]]
    console.log('path', currentPath)

    if (onShow) {
        try {
            onShow({
                parent,
                $nestedPage,
                $element,
                goBack: () => {
                    navigateBackFromNestedPage({ parent, view, $nestedPage })
                    if (pageArgs && pageArgs.callback) {
                        pageArgs.callback(pageArgs.callbackArgs)
                    }
                }
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
        const overrideTitle = ($li.is('[loadview]') ? $li : $li.find('.title')).text()
        showNestedPage({
            parent: $li.closest('.page'),
            view,
            key: title,
            overrideTitle
        })
    })
}

function createListHandlersWorkoutCollection() {
    const colors = [
        '#F90D1B',
        '#FE6006',
        '#FDE005',
        '#EC00FC',
        '#9D00FE',
        '#00CF35'
    ]
    const getColor = () => {
        const returnVal = colors.shift()
        colors.push(returnVal)
        return returnVal
    }
    $('#workout-collection').find('.card').each((i, ele) => {
        const $ele = $(ele)
        if ($ele.is('.inactive') || $ele.find('.inactive').length > 0) {
            $ele.html($ele.text() + `<br/> (Lv. ${ $ele.index() } Required)`)
        }
        $ele.css({
            'background': getColor(),
            'color': '#fff'
        })
    })
    $('#workout-collection').find('li,.card').click(e => {
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
        const $viewEle = ($li.is('[loadview]') ? $li : $li.find('[loadview]'))
        const view = $viewEle.attr('loadview')
        const viewargs = $viewEle.attr('loadviewargs')
        const overrideTitle = $li.is('[loadview]') ? undefined : $li.find('.title').text()
        showNestedPage({
            parent: $li.closest('.page'),
            view,
            key: title,
            overrideTitle
        }, {
            callback: ({ loadview, friends }) => {
                if (!loadview) {
                    return
                }
                showNestedPage({
                    parent: $li.closest('.page'),
                    view: loadview,
                    key: title,
                    overrideTitle
                }, { friends })
            },
            viewargs
        })
    })
}

function getPageTitle() {
    const $title = selectedPage.find('.navigation .title')
    console.log($title)
    return $title.text()
}

function createSearchHandler() {
    const $workouts = $('#workouts-A,#workouts-B')
    const $lis = $workouts.find('li,.card')
    const $search = $('#search')
    const $searchContainer = $search.parent()
    $search.keyup(_ => {
        const searchValue = $search.val().toLowerCase()
        $lis.each((_, li) => {
            const liText = $(li).text().trim().toLowerCase()
            const showLi = (liText.includes(searchValue))
            $(li).toggleClass('hidden', !showLi)
        })
        const hasSearchQuery = ($search.val().length > 0)
        $searchContainer.toggleClass('search-has-value', hasSearchQuery)
    })

    const $searchCancelBtn = $('.search-cancel')
    $searchCancelBtn.click(e => {
        e.preventDefault()

        $search.val('')
        $search.trigger('keyup')
    })
}

function showInviteModal(msg = `Enola has invited you to <b>"Easy Chest Workout"</b> <br>Click here to accept`) {
    const $alert = $('.alerts')
    if ($alert.hasClass('active')) {
        return console.warn('Alert already showing!')
    }
    $alert.html(msg)
    $alert.addClass('active')
    setTimeout(_ => $alert.removeClass('active'), 5000)
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
    $('[href="#friends"]').click(e => {
        e.preventDefault()
        
        showNestedPage({
            parent: $(e.target).closest('.page'),
            view: ViewService.ROUTES.Friends.uid,
            overrideTitle: 'Friends'
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

function createGoalsListener() {
    const finish = () => {
        $('.first-open').addClass('fade-out')
    }
    const nextStep = () => {
        const $currentStep = $('.first-open .fo-step:not(.hidden)')
        const $nextStep = $currentStep.next()
        if ($nextStep.length === 0) {
            return finish()
        }
        $currentStep.addClass('hidden')
        $nextStep.removeClass('hidden')
    }
    $('.next-step').on('click', _ => nextStep())
    $('.skip-step').on('click', _ => { nextStep(); nextStep(); })
}

function main() {
    console.log('main')
    $('[href="#"]').click(e => {
        e.preventDefault()
    })

    $('[href="#back"]').click(e => navigateBackFromNestedPage())
    
    initPages()
    setViewHeight()
    centerPhonePosition()
    createSearchHandler()
    createListHandlersWorkout()
    createListHandlersWorkoutCollection()
    createListHandlersStatistics()
    createProfileHandlers()
    createTabbarHandlers()
    processUrlParams()

    createGoalsListener()

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
    $('.phone').css({ 'version': 'A' })
}

function getAllPaths() {
    return allPaths
}

$(_ => {
    main()

    $(window).resize(() => {
        centerPhonePosition()
    })

    Object.assign(window, {
        publicFunctions: {
            getPageIndex,
            initPages,
            toggleFlyout,
            createFlyoutHandlers,
            createTabbarHandlers,
            selectPage,
            navigateBackFromNestedPage,
            navigateBackFromNestedPages,
            showNestedPage,
            setViewHeight,
            setNestedPageHeight,
            centerPhonePosition,
            createListHandlersStatistics,
            createListHandlersWorkout,
            getPageTitle,
            createSearchHandler,
            createProfileHandlers,
            showInviteModal
        },
        getAllPaths
    })
})