import { ZodError, ZodType } from "zod";

export const validateBody = (schema) => {
  return (req, res, next) => {
    if (schema instanceof ZodType) {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (e) {
        if (e instanceof ZodError) {
          return res.status(400).send({
            error: "Validation failed",
            details: e.issues,
          });
        }

        console.error(e);
        return res.status(500).send({
          error: "Internal server Error when validating body",
        });
      }
    }
  };
};

export const validateParam = (schema) => {
  return (req, res, next) => {
    if (schema instanceof ZodType) {
      try {
        schema.parse(req.params);
        next();
      } catch (e) {
        if (e instanceof ZodError) {
          return res.status(400).send({
            error: "Invalid params",
            details: e.issues,
          });
        }

        console.error(e);
        return res.status(500).send({
          error: "Internal server Error when validating params",
        });
      }
    }
  };
};
