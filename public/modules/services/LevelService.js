export class LevelService {

    /**
     * @returns {LevelService}
     */
     static get() {
        /** @type {LevelService} */
        let levelService = window.levelService
        if (levelService) {
            if (!(levelService instanceof LevelService)) {
                throw new Error(`window.levelService is already defined somewhere else!`)
            }
        } else {
            levelService = new LevelService()
            window.levelService = levelService
        }
        return levelService
    }

    constructor() {

    }

}