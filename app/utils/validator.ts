import { showToast } from "./notifications";

export const validateLead = (data: { name: string; email: string }) => {
  const name = data.name?.trim() || "";
  const email = data.email?.trim().toLowerCase() || "";

  if (!name || !email) {
    showToast.error("Please fill in all required fields.");
    return null;
  }

  if (name.length > 50) {
    showToast.error("Name is too long (Max 50 characters).");
    return null;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    showToast.error("Invalid email format.");
    return null;
  }

  return { name, email }; // Return cleaned data
};