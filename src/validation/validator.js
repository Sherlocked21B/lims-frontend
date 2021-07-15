import joi from "@hapi/joi";
export const addCustomerValidation = (data) => {
	const schema = joi.object({
		firstName: joi.string().min(4).required(),
		lastName: joi.string().min(4),
		email: joi.string().email(),
		address: joi.string().min(3),
		gender: joi.string(),
		contactNumber: joi.number().integer().required(),
	});
	return schema.validate(data);
};
export const loginvalidation = (data) => {
	const schema = joi.object({
		userName: joi.string().min(4).required(),
		password: joi.string().min(6).required(),
	});
	return schema.validate(data);
};

export const addSampleValidaiton = (data) => {
	const schema = joi.object({
		sampleNo: joi.string().min(4).required(),
		samplingDate: joi.date().required(),
		sampleSubmittedBy: joi.string().min(4).required(),
		petName: joi.string().required(),
		categoryValue: joi
			.object()
			.min(1)
			.required()
			.error(() => {
				return {
					message: "Category Name is required",
				};
			}),
		animalName: joi.string().min(1).required(),
		breed: joi.string().required(),
		gender: joi.string().required(),
		petOwner: joi.string().allow("").optional(),
	});
	return schema.validate(data);
};

export const addTestValidator = (data) => {
	const schema = joi.object({
		testName: joi.string().min(3).required(),
	});
	return schema.validate(data);
};

export const addParameterValidator = (data) => {
	const schema = joi.object({
		parameters: joi.string().required(),
		units: joi.string().required(),
		cost: joi
			.number()
			.greater(0)
			.error(() => {
				return {
					message: "Cost cannot be negative or zero",
				};
			}),
	});
	return schema.validate(data);
};

export const addReagentValidator = (data) => {
	const schema = joi.object({
		reagentName: joi.string().required(),
		unit: joi.string().required(),
		volume: joi.number().required(),
	});
	return schema.validate(data);
};

export const importReagentValidator = (data) => {
	const schema = joi.object({
		reagentName: joi
			.object()
			.min(1)
			.required()
			.error(() => {
				return {
					message: "Reagent Name is required",
				};
			}),
		volume: joi
			.number()
			.greater(0)
			.error(() => {
				return {
					message: "Volume is required",
				};
			}),
	});
	return schema.validate(data);
};

export const registervalidation = (data) => {
	const schema = joi.object({
		userName: joi.string().min(4).required(),
		password: joi.string().min(6).required(),
		role: joi.string().required(),
	});
	return schema.validate(data);
};

export const addEquipmentValidator = (data) => {
	const schema = joi.object({
		equipmentName: joi.string().required(),
		description: joi.string().required(),
		quantity: joi.number().required(),
	});
	return schema.validate(data);
};

export const handleEquipmentValidator = (data) => {
	const schema = joi.object({
		equipmentName: joi
			.object()
			.min(1)
			.required()
			.error(() => {
				return {
					message: "Equipment Name is required",
				};
			}),
		quantity: joi
			.number()
			.greater(0)
			.error(() => {
				return {
					message: "Qunatity is required",
				};
			}),
	});
	return schema.validate(data);
};

export const categoryValidator = (data) => {
	const schema = joi.object({
		category: joi
			.string()
			.required()
			.error(() => {
				return {
					message: "Name Of Category Is Required",
				};
			}),
	});
	return schema.validate(data);
};

export const speciesValidator = (data) => {
	const schema = joi.object({
		species: joi
			.string()
			.required()
			.error(() => {
				return {
					message: "Species Name Is Required",
				};
			}),
	});
	return schema.validate(data);
};

export const paymentDoneValidator = (data) => {
	const schema = joi
		.number()
		.less(data.testFee)
		.error(() => {
			return {
				message: "Payment amount can't be greater than Total Cost of Due Fee",
			};
		});
	return schema.validate(data.paymentAmount);
};

export const methodValidator = (data) => {
	const schema = joi.object({
		method: joi
			.string()
			.required()
			.error(() => {
				return {
					message: "Method Is Required",
				};
			}),
	});
	return schema.validate(data);
};
