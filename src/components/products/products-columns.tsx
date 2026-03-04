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
        id: "imagen",
        accessorKey: "imageUrl",
        header: "Imagen",
        cell: ({ row }) => {
            const url = row.getValue("imageUrl") as string;
            const finalUrl = url
                ? `http://localhost:8080${url}`
                : "/placeholder.png";

            return (
                <img
                    src={finalUrl}
                    alt="Producto"
                    className="w-12 h-12 object-cover rounded-md border" />
            )
        }
    },
    {
        id: "nombre",
        accessorKey: "name",
        header: "Nombre",
    },
    {
        id: "precio",
        accessorKey: "price",
        header: "Precio",
        cell: ({ row }) => {
            const priceValue = row.getValue("price") as number;
            const formttedPrice = new Intl.NumberFormat("es-Mx", {
                style: "currency",
                currency: "MXN",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(priceValue);
            return (
                <span className="font-semibold">{formttedPrice}</span>
            )
        }
    },
    {
        id: "area",
        accessorKey: "area",
        header: "Area",
        cell: ({ row }) => {
            const areaValue = row.getValue("area") as number;
            const areaName = areaEnumMapping[areaValue] || "Desconocido";
            const areaColorClass = areaName === "Cocina" ? "text-yellow-500" : areaName === "Bar" ? "text-blue-500" : "text-gray-500";
            return (
                <span className={`font-semibold ${areaColorClass}`}>{areaName}</span>
            );
        }
    },
    {
        id: "categoria",
        accessorKey: "category.name",
        header: "Categoria",
    },
    {
        id: "unidad de medida",
        accessorKey: "unitOfMeasure",
        header: "Unidad de Medida",
        cell: ({ row }) => {
            const unitOfMeasureValue = row.getValue("unitOfMeasure") as number;
            const unitOfMeasureName = unitOfMeasureEnumMapping[unitOfMeasureValue] || "Desconocido";
            return (
                <span>{unitOfMeasureName}</span>
            )
        }
    },
    {
        id: "unidad",
        accessorKey: "unit",
        header: "Unidad",
    },
    {
        id: "stock",
        accessorKey: "stockQuantity",
        header: "Stock",
    },
    {
        id: "activo",
        accessorKey: "isActive",
        header: "Activo",
        cell: ({ row }) => {
            const isActive = row.getValue("isActive");
            return (
                <span className={`font-semibold ${isActive ? "text-green-500" : "text-red-500"}`}>
                    {isActive ? "Activo" : "Inactivo"}
                </span>
            )
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
                    <DropdownMenuItem onClick={() => onEdit(row.original)}>Editar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(row.original)}>Eliminar</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
