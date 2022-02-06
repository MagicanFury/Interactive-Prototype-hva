export default function() {
    return {
        title: undefined,
        $element: $(`
            <div class="container">
                <div class="row text-center" style="">
                    <p class="col-12 pr"><span>Personal Record: </span> <span>21</span></p>
                </div>
                <div class="row text-center exercise-step-1">
                    <p class="ios-h1">Instructions</p>
                    <p>Please place the camera to show yourself as the image below. Press Start & Do as many pushups in a row as you can!</p>
                </div>
                <div class="row justify-content-center exercise-step-1">
                    <div class="col-10">
                        <img class="example" src="/img/knee-pushup-stance.png">
                        <br/>
                        <button id="start" class="btn btn-success full-width">Start</button>
                    </div>
                </div>
                <div class="row justify-content-center hidden exercise-step-2">
                    <div class="col-10">
                        <img class="camera-placeholder" style="width: 100%; margin-bottom: 8px;" src="/img/camera-placeholder.jpg">
                        <input id="pushupInput" type="number" class="form-control" placeholder="Enter How many Pushups you did">
                        <br/>
                        <button id="finish" class="btn btn-primary full-width">Finish Workout</button>
                    </div>
                </div>
            </div>
        `),
        onShow({ $element, goBack }) {
            const $start = $element.find('#start')
            const $finish = $element.find('#finish')
            const $step1 = $element.find('.exercise-step-1')
            const $step2 = $element.find('.exercise-step-2')
            const $pushup = $element.find('#pushupInput')

            const loop = () => {
                if ($pushup.length) {
                    $pushup.val((Number($pushup.val()) || 0) + 1)
                    setTimeout(_ => loop(), 1000)
                }
            }

            $start.on('click', _ => {
                $step1.addClass('hidden')
                $step2.removeClass('hidden')
                loop()
            })

            $finish.on('click', _ => {
                goBack()
            })
        }
    }
}