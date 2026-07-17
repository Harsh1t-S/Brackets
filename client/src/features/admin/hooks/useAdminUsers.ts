import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, setUserRole } from "../services/adminUser.service";

const QUERY_KEY = ["admin-users"];

export function useAdminUsers() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: getUsers });
}

export function useSetUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: "USER" | "ADMIN" }) =>
      setUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
