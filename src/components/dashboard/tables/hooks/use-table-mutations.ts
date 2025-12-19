import { useTRPC } from "@/trpc/client";
import { TableWithRelations } from "@/types/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useTableMutations(eventId: string) {
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
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: [["table", "getTables"], { input: { eventId } }],
        });

        const previousTables = queryClient.getQueryData<TableWithRelations[]>([
          ["table", "getTables"],
          { input: { eventId } },
        ]);

        if (previousTables) {
          queryClient.setQueryData<TableWithRelations[]>(
            [["table", "getTables"], { input: { eventId } }],
            previousTables.map((table) =>
              table.id === variables.tableId
                ? {
                    ...table,
                    positionX: variables.positionX,
                    positionY: variables.positionY,
                  }
                : table
            )
          );
        }

        return { previousTables };
      },
      onError: (_err, _variables, context) => {
        // Rollback to previous value on error
        if (context?.previousTables) {
          queryClient.setQueryData(
            [["table", "getTables"], { input: { eventId } }],
            context.previousTables
          );
        }
      },
      onSettled: () => {
        invalidateTables();
      },
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
