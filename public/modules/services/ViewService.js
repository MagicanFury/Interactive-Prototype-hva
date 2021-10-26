import workout_plank from '../views/workout_plank.js'
import workout_kneepushup from '../views/workout_kneepushup.js'

const views = {
    workout_plank,
    workout_kneepushup
}

export class ViewService {
    
    /**
     * @returns {ViewService}
     */
     static get() {
        /** @type {ViewService} */
        let viewService = window.viewService
        if (viewService) {
            if (!(viewService instanceof ViewService)) {
                throw new Error(`window.viewService is already defined somewhere else!`)
            }
        } else {
            viewService = new ViewService()
            window.viewService = viewService
        }
        return viewService
    }

    constructor() {
        this.workouts = views
    }

    /**
     * @param {*} key 
     * @returns {{title: string, $element: any}}
     */
    loadView(key) {
        if (!this.workouts.hasOwnProperty(key)) {
            throw new Error(`ViewService.workouts[${key}] doesn't exist!`)
        }
        return this.workouts[key]()
    }

}

ViewService.VIEWS = {
    'workout_plank': 'workout_plank',
    'workout_kneepushup': 'workout_plank'
}