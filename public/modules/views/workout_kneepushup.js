export default function() {
    return {
        title: undefined,
        $element: $(`
        <div class="container">
            <div class="row text-center">
                <p class="col-12 pr"><span>Personal Record: </span> <span>21</span></p>
            </div>
            <div class="row justify-content-center">
                <div class="col-10">
                    <input type="number" class="form-control" placeholder="Enter How many Pushups you did">
                    <br/>
                    <button class="btn btn-primary full-width">Finish Pushups</button>
                </div>
            </div>
        </div>
        `)
    }
}