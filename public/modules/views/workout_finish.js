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
        title: 'Workout Finished!',
        $element: $(`
            <div class="container full-height" style="background: var(--list-back-color)">
                <div class="row text-center">
                    <h3>Take some rest!</h3>
                </div>
                <div class="bottom-float">
                    <button id="finish" class="btn btn-primary full-width">View all workouts</button>
                </div>
            </div>
        `),
        onShow({ $element, goBack }) {
            console.log(args)
            const $finish = $element.find('#finish')
            $finish.click(e => {
                const friendCount = $element.find('.ios-list li.selected').length
                args.callbackArgs = {
                    friends: friendCount,
                    loadview: args.viewargs
                }
                publicFunctions.navigateBackFromNestedPages()
            })
        }
    }
}