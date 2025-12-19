import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useTableMutations() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const invalidateTables = async () => {
    await queryClient.invalidateQueries(trpc.table.pathFilter());
  };
  const invalidateInvitations = async () => {
    await queryClient.invalidateQueries(trpc.invitation.pathFilter());
  };

  const updatePosition = useMutation(
    trpc.table.updateTablePosition.mutationOptions({
      onSuccess: invalidateTables,
    })
  );

  const deleteTable = useMutation(
    trpc.table.deleteTable.mutationOptions({
      onSuccess: () => {
        invalidateTables();
        invalidateInvitations();
      },
    })
  );

  const createTable = useMutation(
    trpc.table.createTable.mutationOptions({
      onSuccess: () => {
        invalidateTables();
        invalidateInvitations();
      },
    })
  );

  const handlePositionChange = async (
    tableId: string,
    x: number,
    y: number
  ) => {
    await updatePosition.mutateAsync({ tableId, positionX: x, positionY: y });
  };

  const handleDelete = async (tableId: string) => {
    await deleteTable.mutateAsync({ tableId });
  };

  return {
    updatePosition,
    deleteTable,
    createTable,
    handlePositionChange,
    handleDelete,
    invalidateTables,
  };
}
