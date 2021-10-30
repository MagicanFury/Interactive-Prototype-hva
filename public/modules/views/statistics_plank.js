export default function() {
    return {
        title: undefined,
        $element: $(`
            <div class="container">
                <div class="row text-center">
                    <p class="col-12 pr">
                        <span>Personal Record: </span> <span>01:35</span>
                    </p>
                    <img src="/img/chart-plank.png">
                </div>
            </div>
        `)
    }
}