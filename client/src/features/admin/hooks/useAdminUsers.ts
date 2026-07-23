import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, setUserRole, deleteUser } from "../services/adminUser.service";

const USERS_KEY = "admin-users";

export function useAdminUsers(search?: string, page = 1) {
  const term = search?.trim() ?? "";
  return useQuery({
    queryKey: [USERS_KEY, term, page],
    queryFn: () => getUsers(term || undefined, page),
  });
}

export function useSetUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: "USER" | "ADMIN" }) =>
      setUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
      // A deleted user's rows also drop off the dashboard counts.
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
