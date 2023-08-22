import * as Yup from 'yup';
export const createTaxValidator = Yup.object({
    name: Yup.string().required("Name is required."),
    percentage: Yup.number().required("Percentage is required.")
});
export const updateTaxValidator = Yup.object({
    name: Yup.string().required("Name is required."),
    percentage: Yup.number().required("Percentage is required."),
    draft: Yup.boolean().required("Tax status is required.")
});
//# sourceMappingURL=tax.validators.js.map