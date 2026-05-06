import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import { Pencil, Trash } from "lucide-react";
import type { CategoryResponse } from "@/features/categories/types/category";

type Actions = {
  onEdit: (category: CategoryResponse) => void;
  onDelete: (category: CategoryResponse) => void;
};

export const getCategoryColumns = ({
                                     onEdit,
                                     onDelete,
                                   }: Actions): ColumnDef<CategoryResponse>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const category = row.original;

      return (
          <div className="flex flex-col">
            <span className="font-medium">{category.name}</span>
            <span className="text-xs text-muted-foreground">
            ID: {category.categoryId}
          </span>
          </div>
      );
    },
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      const color = row.original.color;

      return (
          <div className="flex items-center gap-2">
            <div
                className="w-5 h-5 rounded-full border"
                style={{ backgroundColor: color }}
            />
            <span className="text-sm text-muted-foreground">
            {color}
          </span>
          </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const category = row.original;

      return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                >
                  <IconDotsVertical />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => onEdit(category)}
                  className="text-blue-500 cursor-pointer"
                  >
                  <Pencil className="mr-2 h-4 w-4 text-blue-500 fill-blue-500" />
                  Editar
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => onDelete(category)}
                    className="text-red-600 cursor-pointer"
                >
                  <Trash className="mr-2 h-4 w-4 text-red-500 fill-red-500" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
      );
    },
  },
];