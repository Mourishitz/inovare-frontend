import { UserRole } from "~/types";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, isAuthenticated, checkAuth } = useAuth();
  console.log("User middleware: Checking authentication and role...");
  console.log("Current user:", user.value);
  console.log("Is authenticated:", isAuthenticated.value);

  // Ensure user is authenticated first
  if (!isAuthenticated.value) {
    await checkAuth();
  }

  if (!isAuthenticated.value) {
    return navigateTo("/login");
  }

  // Check if user has bride/user role (not admin)
  if (user.value?.role !== UserRole.BRIDE) {
    return navigateTo("/admin");
  }
});
