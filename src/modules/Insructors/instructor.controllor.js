import express from 'express'
import * as services from './services/instructor.services.js'
import verifyToken,{validationAdmin} from '../../middlwares/auth.middlewares.js'
import {  validate} from '../../middlwares/validation.middleware.js'
import { cloudFileUpload } from '../../utiles/cloudinary.js'
import { delPhotoInstructorSchema, instructorSchema, updateInstructorSchema } from '../../validators/instructor.validator.js'
const router=express.Router()

router.post('/add',verifyToken,validationAdmin,validate(instructorSchema),services.addinstructor)
router.post('/:id/photo',verifyToken,validationAdmin,validate(delPhotoInstructorSchema),cloudFileUpload.single("image"),services.uploadphoto)
router.put('/:id/update',verifyToken,validationAdmin,validate(updateInstructorSchema),services.updateinstructor)
router.delete('/:id/delete',verifyToken,validationAdmin,validate(delPhotoInstructorSchema),services.deleteinstructor)
router.get('/search',verifyToken,services.getInstructor)
router.get('/all',verifyToken,services.getInstructors)
router.get('/',verifyToken,validationAdmin,services.list)


export default router