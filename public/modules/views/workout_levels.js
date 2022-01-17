function gotoLevel($ele, view, callback) {
    publicFunctions.showNestedPage({
        parent: $ele.closest('.page'),
        view,
        key: 'Level 1'
    }, { callback })
}

function onLevelFinished({ $element, $lvl }) {
    console.log('FINISHED!')
    $lvl.css({
        'background-color': 'grey'
    })
}

export default function(args) {
    return {
        title: undefined,
        $element: $(`
            <div class="container">
                <div class="row text-center">
                    <p class="col-12 pr">
                        <span style="color: #fff">Next Level: </span> <span style="color: #fff">SITUPS</span>
                    </p>
                </div>
                <div class="levels">
                    <div class="level lv-1">
                        Lv. 1
                    </div>
                    <div class="level lv-2">
                        Lv. 2
                    </div>
                    <div class="level lv-3">
                        Lv. 3
                    </div>
                    <div class="level lv-4">
                        Lv. 4
                    </div>
                </div>
            </div>
        `),
        onShow({ $element, goBack }) {
            $element.css({
                'background': 'url(/img/level-select.png)',
                'height': '100%',
                'background-size': 'cover'
            })
            const $lvls = $element.find('.level')
            $lvls.each((i, lvl) => {
                const $lvl = $(lvl)
                $lvl.on('click', (e) => {
                    gotoLevel($element, 'workout_plank', () => onLevelFinished({
                        $element,
                        $lvls,
                        $lvl
                    }))
                })
            })

            console.log('friends', args.friends)
        }
    }
}