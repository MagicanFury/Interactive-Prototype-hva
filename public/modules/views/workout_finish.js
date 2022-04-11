import { ModalService } from "../services/ModalService.js"

export default function(args) {
    return {
        title: 'Workout Finished!',
        $element: $(`
            <div class="container full-height" style="background: var(--list-back-color)">
                <div class="row text-center mb-3">
                    <h3>How difficult was the exercise?</h3>
                </div>
                <div class="row">
                    <div class=" col-12">
                        <button class="btn btn-primary full-width mb-1">Very Easy</button>
                    </div>
                </div>
                <div class="row">
                    <div class=" col-12">
                        <button class="btn btn-primary full-width mb-1">Easy</button>
                    </div>
                </div>
                <div class="row">
                    <div class=" col-12">
                        <button class="btn btn-primary full-width mb-1">Normal</button>
                    </div>
                </div>
                <div class="row">
                    <div class=" col-12">
                        <button class="btn btn-primary full-width mb-1">Hard</button>
                    </div>
                </div>
                <div class="row">
                    <div class=" col-12">
                        <button class="btn btn-primary full-width mb-1">Very Hard</button>
                    </div>
                </div>
            </div>
        `),
        onShow({ $element, goBack }) {
            console.log(args)
            const $btns = $element.find('.btn.btn-primary')
            $btns.click(e => {
                const friendCount = $element.find('.ios-list li.selected').length
                args.callbackArgs = {
                    friends: friendCount,
                    loadview: args.viewargs
                }
                ModalService.get().popup({
                    title: `Good Work!`,
                    message: `Well done! Go get some rest & drink lots of water!`,
                    type: ModalService.MODAL_TYPES.OK
                }).on([() => {
                    publicFunctions.navigateBackFromNestedPages()
                }])
            })
        }
    }
}