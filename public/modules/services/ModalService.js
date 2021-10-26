export class ModalService {

    /**
     * @returns {ModalService}
     */
    static get() {
        /** @type {ModalService} */
        let modalService = window.modalService
        if (modalService) {
            if (!(modalService instanceof ModalService)) {
                throw new Error(`window.modalService is already defined somewhere else!`)
            }
        } else {
            modalService = new ModalService()
            window.modalService = modalService
        }
        return modalService
    }

    constructor() {

    }

    popup({ title, message, type }) {
        this.events = []
        const $phone = $('.phone')

        const modalBtns = type.map(text => (`
            <button class="col ios-btn">
                ${ text }
            </button>
        `).trim())
        
        const $modal = $(`
            <div class="ios-modal-container">
                <div class="ios-modal">
                    <div class="ios-h1-center">${ title }</div>
                    <div class="ios-message">${ message }</div>
                    <div class="ios-btn-group row">
                        ${ modalBtns }
                    </div>
                </div>
            </div>
        `)
        $modal.find('.ios-btn-group .ios-btn').each((i, btn) => {
            $(btn).click(async (e) => {
                e.preventDefault()
                try {
                    if (!this.events || !this.events[i]) {
                        throw new Error(`Event Handler is not set for modal`)
                    }
                    await Promise.resolve().then(this.events[i]())
                    this.closeModal()
                } catch (err) {
                    console.error(err)
                }
            })
        })

        $phone.prepend($modal)
        this.$modal = $modal

        setTimeout(_ => {
            this.updateMargin()
            $modal.addClass('active')
        }, 50)
        return this
    }

    on(options) {
        options.map((optionCallback, i) => {
            this.events[i] = optionCallback
        })
    }

    updateMargin() {
        const pHeight = $('.phone').height()
        const $m = this.$modal.find('.ios-modal')

        const margin = Math.round((pHeight - $m.height()) / 2) - Math.round($m.height() / 2)
        $m.css({ 'margin-top': `${margin}px` })
    }

    closeModal() {
        const $modalToRemove = this.$modal
        $modalToRemove.removeClass('active')
        setTimeout(_ => $modalToRemove.remove(), 300)
    }

}

ModalService.MODAL_TYPES = {
    CLOSE: ['Close'],
    DELETE_CANCEL: ['Delete', 'Cancel']
}