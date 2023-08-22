import * as Yup from 'yup'


export const updateCategoryValidator = Yup.object({
    name: Yup.string().required("Name is required."),
    draft: Yup.boolean().required("Category status is required.")
})


export const createCategoryValidator = Yup.object({
    name: Yup.string().required("Name is required."),
    draft: Yup.boolean().required("Category status is required."),
    icon: Yup.string(),
    parent_category: Yup.string()
})