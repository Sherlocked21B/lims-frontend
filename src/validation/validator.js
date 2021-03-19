import joi from "@hapi/joi";
export const addCustomerValidation = (data) => {
    const schema = joi.object({
        firstName: joi.string().min(4).required(),
        lastName: joi.string().min(4).required(),
        age: joi.number().integer().min(1).max(110).required(),
        address: joi.string().min(3).required(),
        gender: joi.string().required(),
        contactNumber:joi.number().integer().required(),
  
    });
    return schema.validate(data);
  };
export const addSampleValidaiton = (data) => {
    const schema = joi.object({
        cutomerName: joi.string().min(4).required(),
        dueDate: joi.date().required(),
        collectedBy: joi.string.min(4).required(),
        payment: joi.number().integer.required(),
        testName: joi.string().min(3).required(),
    });
    return schema.validate(data);
  };

<<<<<<< HEAD
export const addTestValidator = (data) =>{
    const schema = joi.object({
      testName: joi.string().min(3).required(),
      testAmount: joi.number().integer().required()
    });
    return schema.validate(data);
  };

export const addParameterValidator = (data) => {
    const schema = joi.object({
      parameters: joi.string().required(),
      units: joi.string().required(),
      refrenceRange: joi.string().required()
    });
    return schema.validate(data);
  };
=======
const addCustomerValidaiton = (data) => {
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

export const addSampleValidaiton = (data) => {
  const schema = joi.object({
    sampleNo: joi.string().required(),
    dueDate: joi.date().required(),
    collectedBy: joi.string().min(3).required(),
    paymentStatus: joi.number().integer().required(),
    testName: joi.string().min(3).required(),
  });
  return schema.validate(data);
};

// export default {
//   addCustomerValidaiton,
//   addSampleValidaiton
// };

export default addCustomerValidaiton;
>>>>>>> 348db6a03e2fd7d5ec1b872485a430bdcf0c53b4
