
export class SessionService {

    /**
     * @returns {SessionService}
     */
    static get() {
        /** @type {SessionService} */
        let sessionService = window.sessionService
        if (sessionService) {
            if (!(sessionService instanceof SessionService)) {
                throw new Error(`window.sessionService is already defined somewhere else!`)
            }
        } else {
            sessionService = new SessionService()
            window.sessionService = sessionService
        }
        return sessionService
    }

    constructor() {
        Object.keys(SessionService.KEYS).map(key => {
            SessionService.KEYS[key] = key
        })
    }

    save(key, value) {
        localStorage.setItem(key, JSON.parse(value))
        return value
    }

    load(key, defaultValue) {
        const value = localStorage.getItem(key)
        return value !== null ? JSON.parse(value) : defaultValue
    }

}

SessionService.KEYS = {
    Profile:        'AUTO_GENERATED',
    Statistics:     'AUTO_GENERATED'
}