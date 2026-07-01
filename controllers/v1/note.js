const Note = require("./../../models/Note")





exports.addNote = async(req , res , next)=>{
    try {
        const {note} = req.body



    } catch (err) {
        next(err)
    }
}

exports.getNote = (req , res , next)=>{
    try {
        const {noteId} = res.params
    } catch (err) {
        next(err)
    }
}

exports.editNote = (req , res , next)=>{
    try {
        //*Todo
    } catch (err) {
        next(err)
    }
}

exports.removeNote = (req , res , next)=>{
    try {
        //*Todo
    } catch (err) {
        next(err)
    }
}



