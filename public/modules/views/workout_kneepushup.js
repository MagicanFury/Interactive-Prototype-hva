export default function() {
    return {
        title: undefined,
        $element: $(`
        <div class="container">
            <div class="row text-center" style="">
                <p class="col-12 pr"><span>Personal Record: </span> <span>21</span></p>
            </div>
            <div class="row text-center">
                <p class="ios-h1">Instructions</p>
                <p>Perform as many pushups as you can in a row without pause (with your knees to the floor)</p>
            </div>
            <div class="row justify-content-center">
                <div class="col-10">
                    <input type="number" class="form-control" placeholder="Enter How many Pushups you did">
                    <br/>
                    <button class="btn btn-primary full-width">Finish Workout</button>
                </div>
            </div>
        </div>
        `)
    }
}