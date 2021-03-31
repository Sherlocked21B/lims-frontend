import joi from "@hapi/joi";
export const addCustomerValidation = (data) => {
  const schema = joi.object({
    firstName: joi.string().min(4).required(),
    lastName: joi.string().min(4).required(),
    age: joi.number().integer().min(1).max(110).required(),
    address: joi.string().min(3).required(),
    gender: joi.string().required(),
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
    dueDate: joi.date().required(),
    collectedBy: joi.string().min(4).required(),
    paymentStatus: joi.number().integer().required(),
    testName: joi.string().min(3).required(),
  });
  return schema.validate(data);
};

export const addTestValidator = (data) => {
  const schema = joi.object({
    testName: joi.string().min(3).required(),
    testAmount: joi.number().integer().required(),
  });
  return schema.validate(data);
};

export const addParameterValidator = (data) => {
  const schema = joi.object({
    parameters: joi.string().required(),
    units: joi.string().required(),
    referenceRange: joi.string().required(),
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
