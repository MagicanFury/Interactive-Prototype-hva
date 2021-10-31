import workout_plank from '../views/workout_plank.js'
import workout_kneepushup from '../views/workout_kneepushup.js'
import statistics_plank from '../views/statistics_plank.js'
import statistics_kneepushup from '../views/statistics_kneepushup.js'

const views = {
    workout_plank,
    workout_kneepushup,
    statistics_plank,
    statistics_kneepushup
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
        this.views = views
    }

    /**
     * @param {*} key 
     * @returns {{title: string, $element: any}}
     */
    loadView(key) {
        if (!this.views.hasOwnProperty(key)) {
            throw new Error(`ViewService.workouts[${key}] doesn't exist!`)
        }
        return this.views[key]()
    }

}

ViewService.VIEWS = {
    'workout_plank': 'workout_plank',
    'workout_kneepushup': 'workout_plank',
    'statistics_plank': 'statistics_plank',
    'statistics_kneepushup': 'statistics_kneepushup'
}

ViewService.ROUTES = {
    Statistics: {
        uid: 'statistics'
    },
    Workout: {
        uid: 'workout'
    },
    Profile: {
        uid: 'profile'
    }
}