import multer from "multer"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "_" + file.originalname
        cb(null,uniqueName)
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==="application/pdf"){
        cb(null,true)
    }else{
        cb(new Error("Only PDF files are allowed"))
    }
}

const upload= multer({
    storage,fileFilter
})

export default upload