export default function(args) {
    return {
        title: 'Privacy Settings',
        $element: $(`
            <div class="container full-height" style="background: var(--list-back-color)">
                <div class="row hidden">
                    <div class="ios-search-container">
                        <input id="search" type="text" placeholder="Search" /> 
                        <button class="search-cancel">Cancel</button>
                    </div>
                </div>
                <div class="row">
                    <div class="ios-scrollable">
                        <ul class="ios-list">
                            <li class="title">
                                <input type="checkbox" id="privacysettings1">
                                <label for="privacysettings1">Only allow viewing profile by friends</label>
                            </li>
                            <li class="title">
                                <input type="checkbox" id="privacysettings2">
                                <label for="privacysettings2">Display all workouts on profile</label>
                            </li>
                            <li class="title">
                                <input type="checkbox" checked="checked" id="privacysettings3">
                                <label for="privacysettings3">Share data with developers</label>
                            </li>
                            <li class="title">
                                <input type="checkbox" checked="checked" id="privacysettings4">
                                <label for="privacysettings4">Automatically Accept Friend Requests</label>
                            </li>
                            <li class="title">
                                <input type="checkbox" id="allow_cam">
                                <label for="allow_cam">Don't allow camera usage with workouts</label>
                            </li>
                            <li class="title">
                                <input type="checkbox" id="privacysettings5">
                                <label for="privacysettings5">Hide profile to everyone</label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="bottom-float">
                    <button id="save" class="btn btn-primary full-width">Save</button>
                </div>
            </div>
        `),
        onShow({ $element, goBack }) {
            console.log(args)
            const $allowcam = $element.find('#allow_cam')
            $allowcam.on('change', _ => {
                globalThis.allowCam = $allowcam.prop('checked')
            })

            $element.find('#save').click(e => {
                e.preventDefault()
                goBack()
            })
        }
    }
}