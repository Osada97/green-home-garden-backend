const Joi = require("joi");

//User register validaton
const registerValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().required().min(4),
    last_name: Joi.string().required().min(4),
    user_name: Joi.string().required(),
    email: Joi.string().email().required().min(4),
    role: Joi.string(),
    password: Joi.string().min(4).required(),
  });

  return schema.validate(data);
};

//user login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().min(4),
    password: Joi.string().min(4).required(),
  });

  return schema.validate(data);
};

//user details validation
const userDetailsValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().required().min(4),
    last_name: Joi.string().required().min(4),
    user_name: Joi.string().required(),
    email: Joi.string().email().required().min(4),
  });

  return schema.validate(data);
};

//password validation
const passwordValidation = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string().min(4).required(),
    password: Joi.string().min(4).required(),
  });

  return schema.validate(data);
};

//blog user create blog validatoin
const iniitialBlogValidation = (data) => {
  const blogSchema = Joi.object({
    blog_title: Joi.string().required().max(255),
    category: Joi.string().required().max(200),
    plant_env_type: Joi.string().required(),
    plant_type: Joi.string().required(),
    whether_type: Joi.string().required(),
    width: Joi.number().required(),
    height: Joi.number().required(),
    length: Joi.number().required(),
    volume: Joi.number(),
    description: Joi.string().required().max(1000),
  });

  return blogSchema.validate(data);
};

//blog step create blog validation
const blogStepsvalidation = (data) => {
  const blogSteps = Joi.object({
    parent_blog: Joi.string().required(),
    step_title: Joi.string().required().max(255),
    after_time: Joi.number().required(),
    description: Joi.string().required().max(3000),
  });

  return blogSteps.validate(data);
};

//blog comment validation
const blogCommentValidation = (data) => {
  const blogCommentSchema = Joi.object({
    name: Joi.string().required().max(100),
    body: Joi.string().required().max(255),
  });

  return blogCommentSchema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.iniitialBlogValidation = iniitialBlogValidation;
module.exports.blogStepsvalidation = blogStepsvalidation;
module.exports.blogCommentValidation = blogCommentValidation;
module.exports.userDetailsValidation = userDetailsValidation;
module.exports.passwordValidation = passwordValidation;
