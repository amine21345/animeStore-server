// Validation middleware function
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema(req.body);

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorDetails,
      });
    }

    next();
  };
};

module.exports = validate;
