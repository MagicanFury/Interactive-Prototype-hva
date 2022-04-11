function gotoLevel($ele, view, callback) {
    publicFunctions.showNestedPage({
        parent: $ele.closest('.page'),
        view,
        key: '...'
    }, { callback })
}

function onLevelFinished({ $element, $lvl }) {
    console.log('FINISHED!')
    $lvl.css({
        'background-color': 'grey'
    })
}

function loadVideoCall(friends) {
    const $phone = $('.phone')
    for (let i = 0; i < friends; i++) {
        $phone.append($(`
            <div class="videocall"> </div>
        `))
    }
}

export default function(args) {
    return {
        title: 'Invite Friends',
        $element: $(`
            <div class="container full-height" style="background: var(--list-back-color)">
                <div class="row text-center">
                    <h4>Would you like to invite somebody to the workout?</h4>
                </div>
                <div class="row hidden">
                    <div class="ios-search-container">
                        <input id="search" type="text" placeholder="Search" /> 
                        <button class="search-cancel">Cancel</button>
                    </div>
                </div>
                <div class="row">
                    <div class="ios-scrollable">
                        <ul class="ios-list">
                            <li class="title">
                                Ivan
                                <button class="btn btn-warning btn-sm float-right">Invite</button>
                            </li>
                            <li class="title">
                                Enola
                                <button class="btn btn-warning btn-sm float-right">Invite</button>
                            </li>
                            <li>
                                <img class="social-xs" src="/img/whatsapp-xs.png">
                                Invite Using Whatsapp
                            </li>
                            <li>
                                <img class="social-xs" src="/img/fb-xs.png">
                                Invite Facebook Friends
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="bottom-float">
                    <button id="proceedToWorkout" class="btn btn-primary full-width">Start Workout</button>
                </div>
            </div>
        `),
        onShow({ $element, goBack }) {
            console.log(args)
            const $proceed = $element.find('#proceedToWorkout')
            $element.find('.ios-list li.title button').each((_, li) => {
                const $li = $(li)
                $li.on('click', () => {
                    if ($li.hasClass('selected')) {
                        return
                    }
                    $li.addClass('selected')
                    const $spinner = $(`<i class="fas fa-spinner fa-pulse"> </i>`)
                    $li.prepend($spinner)
                    setTimeout(_ => {
                        $spinner.remove()
                        $li.attr('disabled', 'disabled')
                        const friendCount = $element.find('.ios-list li .selected').length
                        loadVideoCall(friendCount)
                    }, 5000)

                    // if ($proceed.attr('disabled') == undefined) {
                    //     $proceed.attr('disabled', 'disabled')
                    //     let orgHtml = $proceed.html()
                    //     $proceed.html('<i class="fas fa-spinner fa-pulse"> </i> Waiting For Friend...')
                    //     setTimeout(_ => {
                    //         $proceed.removeAttr('disabled')
                    //         $proceed.find('i').remove()
                    //         $proceed.text(orgHtml)
                    //         const friendCount = $element.find('.ios-list li.selected').length
                    //         loadVideoCall(friendCount)
                    //     }, 5000)
                    // }
                })
            })
            $proceed.click(e => {
                const friendCount = $element.find('.ios-list li.selected').length
                args.callbackArgs = {
                    friends: friendCount,
                    loadview: args.viewargs
                }
                // return goBack()
                publicFunctions.showNestedPage({
                    parent: $('.page.active'),
                    view: args.viewargs
                }, { friends: friendCount })
            })
        }
    }
}