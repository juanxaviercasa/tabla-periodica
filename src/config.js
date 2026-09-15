export const appConfig = {
  name: "38 Elementos",
  description: "La tabla periódica con los 38 elementos que sí caen en el examen de admisión.",
  contact: {
    phone: "51925475034",
    message: "Hola, quiero el material de química para admisión",
    groupInviteUrl: "https://chat.whatsapp.com/JaM2NRy8dt5IpJsq3ObGT8?s=cl&p=i&mlu=4&ilr=4"
  }
};

export const communityUrl = "https://www.skool.com/quimica-zenit-2639/about";

// Enlace oficial de invitación al grupo de WhatsApp de clases gratuitas de Química Zenit
export const whatsappCommunityUrl =
  "https://chat.whatsapp.com/JaM2NRy8dt5IpJsq3ObGT8?s=cl&p=i&mlu=4&ilr=4";

export const whatsappDirectChatUrl = `https://wa.me/${appConfig.contact.phone}?text=${encodeURIComponent(
  "Hola profesor, vengo de la web app de la Tabla Periódica. Deseo información sobre las clases de química para admisión."
)}`;
