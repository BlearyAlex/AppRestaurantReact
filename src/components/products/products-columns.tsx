import type { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import type { ProductResponse } from "@/types/product";

type Actions = {
    onEdit: (category: ProductResponse) => void;
    onDelete: (category: ProductResponse) => void;
};

const areaEnumMapping: Record<number, string> = {
    0: "Cocina",
    1: "Bar",
};

const unitOfMeasureEnumMapping: Record<number, string> = {
    0: "Unidad (es)",
    1: "Gramo (s)",
    3: "Mililitro (s)"
};

export const getProductColumns = ({ onEdit, onDelete }: Actions): ColumnDef<ProductResponse>[] => [
    {
        id: "imageUrl",
        accessorKey: "imageUrl",
        header: "Imagen",
        cell: ({ row }) => {
            const url = row.original.imageUrl;
            const finalUrl = url
                ? `http://localhost:8080${url}`
                : "/placeholder.png";

            return (
                <img
                    src={finalUrl}
                    alt="Producto"
                    className="w-12 h-12 object-cover rounded-md border"
                />
            );
        }
    },
    {
        id: "name",
        accessorKey: "name",
        header: "Nombre",
    },
    {
        id: "price",
        accessorKey: "price",
        header: "Precio",
        cell: ({ row }) => {
            const price = row.original.price ?? 0;

            return (
                <span className="font-semibold">
                    {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                    }).format(price)}
                </span>
            );
        }
    },
    {
        id: "area",
        accessorKey: "area",
        header: "Area",
        cell: ({ row }) => {
            const areaValue = row.original.area;
            const areaName = areaEnumMapping[areaValue] || "Desconocido";

            const areaColorClass =
                areaName === "Cocina"
                    ? "text-yellow-500"
                    : areaName === "Bar"
                        ? "text-blue-500"
                        : "text-gray-500";

            return (
                <span className={`font-semibold ${areaColorClass}`}>
                    {areaName}
                </span>
            );
        }
    },
    {
        id: "category",
        header: "Categoria",
        accessorFn: (row) => row.category?.name ?? "Sin categoría",
    },
    {
        id: "unitOfMeasure",
        accessorKey: "unitOfMeasure",
        header: "Unidad de Medida",
        cell: ({ row }) => {
            const value = row.original.unitOfMeasure;
            const name = unitOfMeasureEnumMapping[value] || "Desconocido";

            return <span>{name}</span>;
        }
    },
    {
        id: "unit",
        accessorKey: "unit",
        header: "Unidad",
    },
    {
        id: "stockQuantity",
        accessorKey: "stockQuantity",
        header: "Stock",
        cell: ({ row }) => {
            return row.original.stockQuantity ?? 0;
        }
    },
    {
        id: "isActive",
        accessorKey: "isActive",
        header: "Activo",
        cell: ({ row }) => {
            const isActive = row.original.isActive;

            return (
                <span className={`font-semibold ${isActive ? "text-green-500" : "text-red-500"}`}>
                    {isActive ? "Activo" : "Inactivo"}
                </span>
            );
        }
    },
    {
        id: "acciones",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => onEdit(row.original)}>
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(row.original)}
                    >
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
