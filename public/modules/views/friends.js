export default function(args) {
    return {
        title: undefined,
        $element: $(`
            <div class="container full-height" style="background: var(--list-back-color)">
                <div class="row">
                    <div class="ios-search-container">
                        <input id="search" type="text" placeholder="Search By Usercode" /> 
                        <button class="search-cancel">Cancel</button>
                    </div>
                </div>
                <div class="row">
                    <div class="ios-scrollable">
                        <ul class="ios-list">
                            <li class="title">Ivan</li>
                            <li class="title">Enola</li>
                            <li>
                                <img class="social-xs" src="/img/whatsapp-xs.png">
                                Add Friend Using Whatsapp
                            </li>
                            <li>
                                <img class="social-xs" src="/img/fb-xs.png">
                                Add Using Facebook Friends
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `),
        onShow({ $element, goBack }) {
            console.log(args)
            const $proceed = $element.find('#proceedToWorkout')
            $element.find('.ios-list li.title').each((_, li) => {
                const $li = $(li)
                $li.on('click', () => {
                    $li.toggleClass('selected')
                    if ($proceed.attr('disabled') == undefined) {
                        $proceed.attr('disabled', 'disabled')
                        let orgHtml = $proceed.html()
                        $proceed.html('<i class="fas fa-spinner fa-pulse"> </i> Waiting For Friend...')
                        setTimeout(_ => {
                            $proceed.removeAttr('disabled')
                            $proceed.find('i').remove()
                            $proceed.text(orgHtml)
                            const friendCount = $element.find('.ios-list li.selected').length
                            loadVideoCall(friendCount)
                        }, 5000)
                    }
                })
            })
            $proceed.click(e => {
                const friendCount = $element.find('.ios-list li.selected').length
                args.callbackArgs = {
                    friends: friendCount,
                    loadview: args.viewargs
                }
                goBack()
            })
        }
    }
}