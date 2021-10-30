import { ModalService } from "../services/ModalService.js";

let timerStart = -1

function startTimer(callback) {
    timerStart = Date.now()
    timerLoop(callback)
}

function timerLoop(callback) {
    setTimeout(_ => {
        if (timerStart !== -1) {
            callback((Date.now() - timerStart) / 1000.0)
            timerLoop(callback)
        }
    }, 16.7)
}

function stopTimer() {
    timerStart = -1
}

export default function() {
    return {
        title: undefined,
        $element: $(`
            <div class="container">
                <div class="row text-center" style="height: calc(100% - 50px);">
                    <p class="col-12 pr">
                        <span>Personal Record: </span> <span>01:35</span>
                    </p>
                    <span class="time-counter">00:00</span>
                </div>
                <div class="row justify-content-center">
                    <div class="col-10">
                        <button class="btn btn-primary full-width">Start Plank</button>
                        <button class="btn btn-danger full-width hidden">Stop Plank</button>
                        <button class="btn btn-success full-width hidden">Finish & Save Workout</button>
                    </div>
                </div>
            </div>
        `),
        onShow({ $element, goBack }) {
            debugger;
            const $btns = $element.find('.btn')
            const $start = $btns.eq(0)
            const $stop  = $btns.eq(1)
            const $finish = $btns.eq(2)

            $start.click(e => {
                e.preventDefault()
                $start.addClass('hidden')
                $stop.removeClass('hidden')
                const $timer = $element.find('.time-counter')
                startTimer((deltaTime) => {
                    const seconds = Math.round(deltaTime).toString()
                    let displayString = new Date(seconds * 1000).toISOString().substr(14, 5);
                    $timer.text(`${displayString}`)
                })
            })

            $stop.click(e => {
                e.preventDefault()
                $start.addClass('hidden')
                $stop.addClass('hidden')
                $finish.removeClass('hidden')
                stopTimer()
            })

            $finish.click(e => {
                e.preventDefault()

                // ModalService.get().popup({
                //     title: `Good Work!`,
                //     message: `Well done! Go get some rest & drink lots of water!`,
                //     type: ModalService.MODAL_TYPES.OK
                // }).on([goBack])
                
                return goBack()
            })
        }
    }
}