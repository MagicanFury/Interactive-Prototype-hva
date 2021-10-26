export default function() {
    return {
        title: undefined,
        $element: $(`
            <div class="container">
                <div class="row text-center">
                    <p class="col-12 pr">
                        <span>Personal Record: </span> <span>02:23</span>
                    </p>
                    <span class="time-counter">00:00</span>
                </div>
                <div class="row justify-content-center">
                    <div class="col-10">
                        <button class="btn btn-primary full-width">Start Plank</button>
                    </div>
                </div>
                <br/>
                <div class="row justify-content-center">
                    <div class="col-10">
                        <button class="btn btn-primary full-width">Stop Plank</button>
                    </div>
                </div>
            </div>
        `)
    }
}