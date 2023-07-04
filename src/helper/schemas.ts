export const createContainerProps = {
  type: "object",
  properties: {
    name: { type: "string" },
    image: { type: "string" },
    ports: {
      type: "array",
      items: {
        type: "object",
        properties: {
          host: { type: "number" },
          container: { type: "number" }
        }
      }
    }
  },
  required: ["image"],
  additionalProperties: false
}
