export const appConfig = {
  name: "38 Elementos",
  description: "La tabla periódica con los 38 elementos que sí caen en el examen de admisión.",
  contact: {
    phone: "51925475034",
    message: "Hola, quiero el material de química para admisión"
  }
};

export const contactUrl = `https://wa.me/${appConfig.contact.phone}?text=${encodeURIComponent(appConfig.contact.message)}`;
