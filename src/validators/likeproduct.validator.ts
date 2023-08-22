import * as Yup from 'yup'

export const likeProductValidator = Yup.object({
    add_id: Yup.string().required("Add ID is required."),
})