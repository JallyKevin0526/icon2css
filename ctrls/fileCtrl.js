import fileService from '../services/fileService'
class fileCtrl {
    icon2Css (req, res) {
        new fileService().icon2Css(req, res)
    }
}

export default fileCtrl