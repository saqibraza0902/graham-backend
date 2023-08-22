import * as Yup from 'yup';
export const updateBrandValidator = Yup.object({
    name: Yup.string().required("Name is required."),
    draft: Yup.boolean().required("Draft is required.")
});
//# sourceMappingURL=brand.validators.js.map